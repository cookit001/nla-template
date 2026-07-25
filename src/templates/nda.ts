import { NdaInputs } from '@/types';
import { generateDocumentHash } from '@/lib/crypto';

export const MANDATORY_LEGAL_DISCLAIMER = 
  "INFORMATIONAL TEMPLATE ONLY • NOT LEGAL ADVICE • NLA & PARTNERS IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL REPRESENTATION OR ADVICE.";

export function fillNdaTemplate(inputs: NdaInputs): string {
  const sanitize = (val: string) => val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const partyA = sanitize(inputs.partyA);
  const partyB = sanitize(inputs.partyB);
  const date = sanitize(inputs.effectiveDate);
  const purpose = sanitize(inputs.purpose);
  const termYears = inputs.termYears;
  const jurisdiction = sanitize(inputs.governingJurisdiction);
  const hash = generateDocumentHash(inputs);

  return `MUTUAL NON-DISCLOSURE AGREEMENT (INFORMATIONAL TEMPLATE)

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on ${date} ("Effective Date"), by and between:

PARTIES:
1. ${partyA} ("Party A")
2. ${partyB} ("Party B")

(Party A and Party B are individually referred to as a "Party" and collectively as the "Parties").

1. PURPOSE OF DISCLOSURE
The Parties intend to disclose to each other proprietary and confidential information for the sole purpose of:
"${purpose}" (the "Permitted Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" shall include all non-public, confidential, or proprietary information disclosed by one Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally, visually, or in writing, that is designated as confidential or reasonably ought to be understood as confidential given the nature of the information.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees:
a) To keep all Confidential Information strictly confidential using at least reasonable care.
b) Not to use Confidential Information for any purpose other than the Permitted Purpose.
c) Not to disclose Confidential Information to any third party without prior written authorization from the Disclosing Party.

4. TERM & DURATION
This Agreement and the confidentiality obligations herein shall remain in effect for a period of ${termYears} (${termYears === 1 ? 'one' : termYears}) year(s) from the Effective Date.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}, without regard to its conflict of law principles.

6. DISCLAIMER OF LEGAL ADVICE
THIS FORM IS A STANDARDIZED INFORMATIONAL TEMPLATE PROVIDED AS-IS FOR UTILITY PURPOSES BY NLA & PARTNERS (9REALMS STUDIOS). IT DOES NOT CONSTITUTE FORMAL LEGAL ADVICE OR LEGAL REPRESENTATION. PARTIES ARE ADVISED TO CONSULT INDEPENDENT QUALIFIED LEGAL COUNSEL FOR SPECIFIC LEGAL TRANSACTIONS.

IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the Effective Date.


________________________________________
Party A: ${partyA}
Date: ${date}


________________________________________
Party B: ${partyB}
Date: ${date}

--------------------------------------------------------------------------------
DOCUMENT INTEGRITY VERIFICATION SIGNATURE: [SHA256:${hash}]
${MANDATORY_LEGAL_DISCLAIMER}`;
}

