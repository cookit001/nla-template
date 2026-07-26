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
  ],
};

export async function parseNdaRequestFromAi(userInput: string): Promise<{
  success: boolean;
  data?: LegalTemplateInputs;
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

    const prompt = `
You are the NLA Templates Structured Data Extractor.

Your sole job:
- Classify and extract approved fields for one of 5 legal templates:
  1. "nda": Non-Disclosure Agreement
  2. "sow": Statement of Work / Development Agreement
  3. "advisory": Web3 Token & Strategic Advisory Agreement
  4. "contractor": Independent Contractor Agreement
  5. "safe": SAFE-T (Simple Agreement for Future Tokens/Equity)
- Return JSON only.
- Do not provide legal advice or write custom clauses.

Approved fields:
- documentType: "nda" | "sow" | "advisory" | "contractor" | "safe" (default "nda")
- partyA: string, default "Party A"
- partyB: string, default "Party B"
- effectiveDate: string, format YYYY-MM-DD or readable date
- purpose: string, concise scope or purpose summary
- termYears: number between 1 and 10, default 2
- governingJurisdiction: string, default "Delaware, USA" (or jurisdiction specified in input)
- outOfScope: boolean

If the request asks for lawsuits, criminal defense, custom litigation, or non-template legal advice, set outOfScope to true.

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
    };
  } catch (err: any) {
    return {
      success: false,
      objection: REJECTION_FALLBACK,
      error: err?.message || 'AI extraction failed',
    };
  }
}
