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
      description: "A beautifully formatted Markdown response summarizing extracted parameters and concluding with mandatory $NLA disclaimer.",
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
  conversationalMessage?: string;
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
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: legalTemplateResponseSchema,
      },
    });

    const prompt = `
You are the $NLA Legal AI Assistant (NLA Intelligence v2.5) for NLA & Partners.

YOUR PERSONA & TONE (Gemini-Inspired):
- Adaptive, collaborative, clear, and professional with modern legaltech precision.
- You must format your 'conversationalMessage' output using clean Markdown: use bold text for key terms and bullet points for scannability.
- Never sound like a rigid corporate manual. Be direct and helpful.

YOUR CORE MISSION:
1. Extract contract parameters from the user's plain-English description for one of 5 legal templates:
   - "nda": Non-Disclosure Agreement
   - "sow": Statement of Work / Development Agreement
   - "advisory": Web3 Token & Strategic Advisory Agreement
   - "contractor": Independent Contractor Agreement
   - "safe": SAFE-T (Simple Agreement for Future Tokens/Equity)
2. Return JSON conforming to the requested schema.
3. Write a brief summary of what you extracted in the 'conversationalMessage' field.

${forceDocumentType ? `IMPORTANT: The user has explicitly selected template type "${forceDocumentType}". You MUST set documentType to "${forceDocumentType}" unless completely out of scope.` : ''}

Approved fields:
- documentType: "nda" | "sow" | "advisory" | "contractor" | "safe" (default "nda")
- partyA: string, default "Party A"
- partyB: string, default "Party B"
- effectiveDate: string, format YYYY-MM-DD or readable date
- purpose: string, concise scope summary without extra wrapping quotes
- termYears: number between 1 and 10, default 2
- governingJurisdiction: string, default "Delaware, USA" (or jurisdiction specified in input)
- outOfScope: boolean
- conversationalMessage: string, a brief Gemini-style markdown message summarizing extracted parameters (bolding key parties, jurisdiction, and term) and ending with the mandatory disclaimer:
"*Informational template only by NLA & Partners. Not legal advice. $NLA*"

If request asks for non-supported legal advice (lawsuits, criminal defense, custom litigation), set outOfScope to true and set conversationalMessage to:
"OBJECTION! That request falls outside the jurisdiction of NLA & Partners templates."

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
        conversationalMessage: parsedJson.conversationalMessage || REJECTION_FALLBACK,
        message: parsedJson.conversationalMessage || REJECTION_FALLBACK,
        objection: REJECTION_FALLBACK,
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
      conversationalMessage: parsedJson.conversationalMessage,
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
