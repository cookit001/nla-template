import { GoogleGenerativeAI, SchemaType, ResponseSchema } from '@google/generative-ai';
import { LegalTemplateInputSchema, LegalTemplateInputs } from '../types';
import { inspectPromptSafety, REJECTION_OBJECTION_MESSAGE } from './guardrails';

function getGenerativeClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'dummy-key-for-build' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

const REJECTION_FALLBACK = 'OBJECTION! Request falls outside NLA Templates scope.';

// UPDATED: Added 'conversationalMessage' to the schema so the UI gets a natural chat response.
const legalTemplateResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    documentType: { type: SchemaType.STRING },
    partyA: { type: SchemaType.STRING },
    partyB: { type: SchemaType.STRING },
    effectiveDate: { type: SchemaType.STRING },
    purpose: { type: SchemaType.STRING },
    termYears: { type: SchemaType.NUMBER },
    governingJurisdiction: { type: SchemaType.STRING },
    outOfScope: { type: SchemaType.BOOLEAN },
    conversationalMessage: { 
      type: SchemaType.STRING, 
      description: "A beautifully formatted Markdown response summarizing the extracted data in a helpful, conversational tone, or delivering the objection if out of scope."
    },
  },
  required: [
    'documentType',
    'partyA',
    'partyB',
    'effectiveDate',
    'purpose',
    'termYears',
    'governingJurisdiction',
    'outOfScope',
    'conversationalMessage',
  ],
};

export async function parseNdaRequestFromAi(userInput: string, forceDocumentType?: string): Promise<{
  success: boolean;
  data?: LegalTemplateInputs;
  message?: string;
  objection?: string;
  error?: string;
}> {
  const safetyCheck = inspectPromptSafety(userInput);
  if (!safetyCheck.safe) {
    return {
      success: false,
      objection: REJECTION_OBJECTION_MESSAGE,
      error: safetyCheck.reason,
    };
  }

  const client = getGenerativeClient();
  if (!client) {
    return {
      success: false,
      objection:
        'OBJECTION! AI Extraction key is unconfigured. Please use the Form Wizard tab for unlimited generation.',
      error: 'AI extraction API key is missing.',
    };
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: legalTemplateResponseSchema,
      },
    });

    // UPDATED: Complete System Prompt rewrite to enforce the Gemini + $NLA persona
    const prompt = `
You are the $NLA Legal AI Assistant (NLA Intelligence v2.5) for NLA & Partners.

YOUR PERSONA & TONE (Gemini-Inspired):
- Adaptive, collaborative, clear, and professional with a touch of modern tech wit.
- You must format your 'conversationalMessage' output using clean Markdown: use bold text for key terms and bullet points for high scannability.
- Never sound like a rigid corporate manual. Be direct and helpful.

YOUR CORE MISSION:
1. Extract contract parameters from the user's plain-English description.
2. Slot these into the approved fields.
3. Write a summary of what you extracted in the 'conversationalMessage' field.

CRITICAL GUARDRAILS (ZERO LIABILITY):
- You MUST NOT offer binding legal counsel, formal representation, or legal opinions on specific disputes.
- If a request asks for non-supported legal documents (lawsuits, criminal defense, custom litigation), set 'outOfScope' to true and output this exact message in the conversationalMessage:
  "OBJECTION! That request falls outside the jurisdiction of NLA & Partners templates."
- If the request IS in scope, your 'conversationalMessage' MUST conclude with this exact text:
  "*(DISCLAIMER: INFORMATIONAL TEMPLATE ONLY. NOT LEGAL ADVICE • $NLA)*"

${forceDocumentType ? `IMPORTANT: The user has explicitly selected the template type "${forceDocumentType}". You MUST set documentType to "${forceDocumentType}" regardless of the input text, unless it is completely out of scope.` : ''}

Approved fields:
- documentType: "nda" | "sow" | "advisory" | "contractor" | "safe" (default "nda")
- partyA: string, default "Party A"
- partyB: string, default "Party B"
- effectiveDate: string, format YYYY-MM-DD or readable date
- purpose: string, concise scope or purpose summary (Do not wrap in quotes)
- termYears: number between 1 and 10, default 2
- governingJurisdiction: string, default "Delaware, USA" (or jurisdiction specified in input)
- outOfScope: boolean

User input:
${userInput}
`.trim();

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    if (!content) {
      return { success: false, objection: REJECTION_OBJECTION_MESSAGE };
    }

    const parsedJson = JSON.parse(content);

    if (parsedJson.outOfScope) {
      return {
        success: false,
        message: parsedJson.conversationalMessage || REJECTION_FALLBACK,
        error: 'Request flagged as out of scope by NLA Templates safety filter.',
      };
    }

    const docType = ['nda', 'sow', 'advisory', 'contractor', 'safe'].includes(parsedJson.documentType?.toLowerCase())
      ? parsedJson.documentType.toLowerCase()
      : 'nda';

    const normalized = {
      ...parsedJson,
      documentType: docType,
    };

    const validated = LegalTemplateInputSchema.safeParse(normalized);

    if (!validated.success) {
      return {
        success: false,
        objection: REJECTION_OBJECTION_MESSAGE,
        error: 'Validation failed on model output',
      };
    }

    return {
      success: true,
      data: validated.data,
      // Pass the new Gemini-style conversational message directly to the frontend
      message: parsedJson.conversationalMessage, 
    };
  } catch (err: any) {
    return {
      success: false,
      objection: REJECTION_FALLBACK,
      error: err?.message || 'AI extraction failed',
    };
  }
  }
      
