import crypto from 'crypto';
import { NdaInputs } from '@/types';

export function generateDocumentHash(inputs: NdaInputs): string {
  const payload = [
    inputs.partyA.trim(),
    inputs.partyB.trim(),
    inputs.effectiveDate.trim(),
    inputs.purpose.trim(),
    inputs.termYears.toString(),
    inputs.governingJurisdiction.trim(),
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16).toUpperCase();
}
