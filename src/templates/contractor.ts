import { LegalTemplateInputs } from '@/types';
import { generateDocumentHash } from '@/lib/crypto';

export function fillContractorTemplate(inputs: LegalTemplateInputs): string {
  const sanitize = (val: string) => val ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  
  const partyA = sanitize(inputs.partyA); // Hiring Client
  const partyB = sanitize(inputs.partyB); // Independent Contractor
  const date = sanitize(inputs.effectiveDate);
  const scope = sanitize(inputs.purpose);
  const termYears = inputs.termYears || 1;
  const jurisdiction = sanitize(inputs.governingJurisdiction);
  const hash = generateDocumentHash(inputs);

  return `INDEPENDENT CONTRACTOR & FREELANCE SERVICES AGREEMENT (ICSA)

This Independent Contractor Agreement ("Agreement") is made effective as of ${date}, by and between:

PARTIES:
1. ${partyA} ("Client")
2. ${partyB} ("Contractor")

1. SERVICES
Client engages Contractor to perform the following specialized independent services:
"${scope}"

2. COMPENSATION & PAYMENT
Client agrees to pay Contractor for services rendered according to agreed invoices. Contractor is solely responsible for all taxes, withholdings, and statutory insurance obligations.

3. OWNERSHIP OF WORK PRODUCT
Contractor agrees that all original works, code, designs, and deliverables created pursuant to this Agreement belong to Client as work-made-for-hire upon settlement of invoice.

4. DURATION & TERMINATION
This Agreement shall remain in effect for ${termYears} year(s) unless terminated by either Party with seven (7) days written notice.

5. GOVERNING LAW
Governed by and interpreted under the laws of ${jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this Independent Contractor Agreement.

________________________________________
Client: ${partyA}
Date: ${date}

________________________________________
Contractor: ${partyB}
Date: ${date}

--------------------------------------------------------------------------------
DOCUMENT INTEGRITY VERIFICATION SIGNATURE: [SHA256:${hash}]
INFORMATIONAL TEMPLATE ONLY • NOT LEGAL ADVICE • NLA TEMPLATES`;
}
