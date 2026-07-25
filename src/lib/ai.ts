import { GoogleGenerativeAI, SchemaType, ResponseSchema } from '@google/generative-ai';
import { NdaInputSchema, NdaInputs } from '../types';
import { inspectPromptSafety, REJECTION_OBJECTION_MESSAGE } from './guardrails';

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'dummy-key-for-build' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

const REJECTION_FALLBACK = 'OBJECTION! Request falls outside NLA & Partners scope.';

const ndaResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    partyA: { type: SchemaType.STRING },
    partyB: { type: SchemaType.STRING },
    effectiveDate: { type: SchemaType.STRING },
    purpose: { type: SchemaType.STRING },
    termYears: { type: SchemaType.NUMBER },
    governingJurisdiction: { type: SchemaType.STRING },
    outOfScope: { type: SchemaType.BOOLEAN },
  },
  required: [
    'partyA',
    'partyB',
    'effectiveDate',
    'purpose',
    'termYears',
    'governingJurisdiction',
    'outOfScope',
  ],
};

export async function parseNdaRequestFromAi(userInput: string): Promise<{
  success: boolean;
  data?: NdaInputs;
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

  const client = getGeminiClient();
  if (!client) {
    return {
      success: false,
      objection:
        'OBJECTION! Gemini API key is missing or unconfigured. Please add a valid GEMINI_API_KEY to .env.local or use the Structured Inputs tab.',
      error: 'GEMINI_API_KEY is not configured.',
    };
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: ndaResponseSchema,
      },
    });

    const prompt = `
You are the NLA & Partners Structured Data Extractor.

Your sole job:
- Extract approved fields for a standard NDA template from the user's input.
- Return JSON only.
- Do not provide legal advice.
- Do not draft custom clauses.
- Do not modify the template.

Approved fields:
- partyA: string, default "Party A"
- partyB: string, default "Party B"
- effectiveDate: string, format YYYY-MM-DD or readable date string
- purpose: string, summary of disclosure purpose
- termYears: number between 1 and 10, default 2
- governingJurisdiction: string, default "Federal Republic of Nigeria"
- outOfScope: boolean

If the request is for legal advice, custom drafting, lawsuits, non-NDA contracts, or anything outside the supported template, set outOfScope to true and fill the rest with safe defaults.

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
        objection: REJECTION_FALLBACK,
        error: 'Request flagged as out of scope by Gemini.',
      };
    }

    const normalized = {
      ...parsedJson,
      documentType: 'nda',
    };

    const validated = NdaInputSchema.safeParse(normalized);

    if (!validated.success) {
      return {
        success: false,
        objection: REJECTION_OBJECTION_MESSAGE,
        error: 'Zod validation failed on model output',
      };
    }

    return {
      success: true,
      data: validated.data,
    };
  } catch (err: any) {
    return {
      success: false,
      objection: REJECTION_OBJECTION_MESSAGE,
      error: err?.message || 'AI extraction failed',
    };
  }
}
