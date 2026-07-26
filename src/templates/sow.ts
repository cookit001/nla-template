import { LegalTemplateInputs } from '@/types';
import { generateDocumentHash } from '@/lib/crypto';

export function fillSowTemplate(inputs: LegalTemplateInputs): string {
  const sanitize = (val: string) => val ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  
  const partyA = sanitize(inputs.partyA); // Client
  const partyB = sanitize(inputs.partyB); // Service Provider
  const date = sanitize(inputs.effectiveDate);
  const scope = sanitize(inputs.purpose);
  const termYears = inputs.termYears || 1;
  const jurisdiction = sanitize(inputs.governingJurisdiction);
  const hash = generateDocumentHash(inputs);

  return `STATEMENT OF WORK & SERVICES AGREEMENT (SOW)

This Statement of Work ("SOW") is effective as of ${date} ("Effective Date"), by and between:

PARTIES:
1. ${partyA} ("Client")
2. ${partyB} ("Service Provider")

1. SCOPE OF SERVICES & DELIVERABLES
Service Provider agrees to perform technical, advisory, and software development services for Client as set forth below:
"${scope}"

2. PERFORMANCE STANDARDS & MILESTONES
Service Provider shall perform the Services in a professional and workmanlike manner in accordance with industry standards. All work product developed hereunder shall be delivered according to agreed project specifications.

3. INTELLECTUAL PROPERTY RIGHTS
Upon full payment of all fees due hereunder, all custom deliverables and intellectual property created specifically for Client pursuant to this SOW shall belong exclusively to Client. Service Provider retains ownership of its pre-existing tools, libraries, and frameworks.

4. TERM & TERMINATION
This SOW shall commence on the Effective Date and remain in effect for a term of ${termYears} year(s), unless terminated earlier by either Party upon thirty (30) days prior written notice.

5. GOVERNING LAW & JURISDICTION
This SOW shall be governed by, construed, and enforced in accordance with the laws of ${jurisdiction}, without giving effect to conflict of laws principles.

6. DISCLAIMER & DETERMINISTIC HASH VERIFICATION
THIS DOCUMENT IS AN IMMUTABLE LEGAL TEMPLATE GENERATED VIA NLA TEMPLATES (9REALMS STUDIOS). IT IS PROVIDED AS AN INFORMATIONAL UTILITY. PARTIES SHOULD CONSULT QUALIFIED LEGAL COUNSEL FOR FORMAL TRANSACTIONS.

IN WITNESS WHEREOF, the Parties have executed this Statement of Work.

________________________________________
Client: ${partyA}
Date: ${date}

________________________________________
Service Provider: ${partyB}
Date: ${date}

--------------------------------------------------------------------------------
DOCUMENT INTEGRITY VERIFICATION SIGNATURE: [SHA256:${hash}]
INFORMATIONAL TEMPLATE ONLY • NOT LEGAL ADVICE • NLA TEMPLATES`;
}
