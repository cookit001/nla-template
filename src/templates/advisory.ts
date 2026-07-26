import { LegalTemplateInputs } from '@/types';
import { generateDocumentHash } from '@/lib/crypto';

export function fillAdvisoryTemplate(inputs: LegalTemplateInputs): string {
  const sanitize = (val: string) => val ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  
  const partyA = sanitize(inputs.partyA); // Company / Project
  const partyB = sanitize(inputs.partyB); // Advisor / Grantee
  const date = sanitize(inputs.effectiveDate);
  const purpose = sanitize(inputs.purpose);
  const termYears = inputs.termYears || 2;
  const jurisdiction = sanitize(inputs.governingJurisdiction);
  const hash = generateDocumentHash(inputs);

  return `WEB3 STRATEGIC ADVISORY & GRANT AGREEMENT (TAGA)

This Web3 Strategic Advisory Agreement ("Agreement") is executed on ${date} ("Effective Date"), by and between:

PARTIES:
1. ${partyA} ("Company")
2. ${partyB} ("Strategic Advisor")

1. ADVISORY SERVICES & MANDATE
Strategic Advisor agrees to provide strategic advice, governance assistance, ecosystem growth, and technical advisory services described as:
"${purpose}"

2. ADVISORY GRANT & COMPENSATION
In consideration for the advisory services, Company grants Strategic Advisor token warrants or advisory compensation subject to customary vesting schedules over a period of ${termYears} year(s).

3. INDEPENDENT CONTRACTOR STATUS
Strategic Advisor is an independent contractor and not an employee, partner, or joint venturer of Company. Neither Party has authority to bind the other.

4. CONFIDENTIALITY & NON-CIRCUMVENTION
Strategic Advisor agrees to keep all non-public technical, financial, and strategic information of Company strictly confidential during the term and for two (2) years thereafter.

5. GOVERNING LAW
This Agreement shall be governed by and construed under the laws of ${jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this Strategic Advisory Agreement.

________________________________________
Company: ${partyA}
Date: ${date}

________________________________________
Strategic Advisor: ${partyB}
Date: ${date}

--------------------------------------------------------------------------------
DOCUMENT INTEGRITY VERIFICATION SIGNATURE: [SHA256:${hash}]
INFORMATIONAL TEMPLATE ONLY • NOT LEGAL ADVICE • NLA TEMPLATES`;
}
