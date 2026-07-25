import { z } from 'zod';

export const NdaInputSchema = z.object({
  documentType: z.literal('nda').default('nda'),
  partyA: z.string().min(1, 'Disclosing Party Name is required'),
  partyB: z.string().min(1, 'Receiving Party Name is required'),
  effectiveDate: z.string().min(1, 'Effective Date is required'),
  purpose: z.string().min(1, 'Purpose of Disclosure is required'),
  termYears: z.number().int().min(1).max(10).default(2),
  governingJurisdiction: z.string().default('Federal Republic of Nigeria'),
});

export type NdaInputs = z.infer<typeof NdaInputSchema>;

export type ParseApiResponse = {
  success: boolean;
  data?: NdaInputs;
  renderedText?: string;
  objection?: string;
  reason?: string;
};

export type AuditLogEntry = {
  timestamp: string;
  eventType: 'NDA_GENERATED' | 'OBJECTION_TRIGGERED' | 'VALIDATION_FAILED';
  documentType: string;
  partyLengthA: number;
  partyLengthB: number;
  reason?: string;
};
