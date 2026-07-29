import { z } from 'zod';

export const LegalDocumentTypeSchema = z.enum(['nda', 'sow', 'advisory', 'contractor', 'safe']);
export type LegalDocumentType = z.infer<typeof LegalDocumentTypeSchema>;

export const LegalTemplateInputSchema = z.object({
  documentType: LegalDocumentTypeSchema.default('nda'),
  partyA: z.string().min(1, 'Party A Name is required'),
  partyB: z.string().min(1, 'Party B Name is required'),
  effectiveDate: z.string().min(1, 'Effective Date is required'),
  purpose: z.string().min(1, 'Scope or Purpose is required'),
  termYears: z.number().int().min(1).max(10).default(2),
  governingJurisdiction: z.string().default('Delaware, USA'),
});

export type LegalTemplateInputs = z.infer<typeof LegalTemplateInputSchema>;
export type NdaInputs = LegalTemplateInputs;

export const NdaInputSchema = LegalTemplateInputSchema;

export type ParseApiResponse = {
  success: boolean;
  data?: LegalTemplateInputs;
  renderedText?: string;
  conversationalMessage?: string;
  objection?: string;
  reason?: string;
  aiGenerationsRemaining?: number;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  renderedText?: string;
  data?: LegalTemplateInputs;
  isObjection?: boolean;
};

export type AuditLogEntry = {
  timestamp: string;
  eventType: 'DOCUMENT_GENERATED' | 'OBJECTION_TRIGGERED' | 'VALIDATION_FAILED' | 'RATE_LIMIT_REACHED';
  documentType: string;
  partyLengthA: number;
  partyLengthB: number;
  reason?: string;
};
