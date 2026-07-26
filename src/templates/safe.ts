import { LegalTemplateInputs } from '@/types';
import { generateDocumentHash } from '@/lib/crypto';

export function fillSafeTemplate(inputs: LegalTemplateInputs): string {
  const sanitize = (val: string) => val ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  
  const partyA = sanitize(inputs.partyA); // Issuer / Company
  const partyB = sanitize(inputs.partyB); // Investor / Funder
  const date = sanitize(inputs.effectiveDate);
  const terms = sanitize(inputs.purpose);
  const termYears = inputs.termYears || 3;
  const jurisdiction = sanitize(inputs.governingJurisdiction);
  const hash = generateDocumentHash(inputs);

  return `SIMPLE AGREEMENT FOR FUTURE TOKENS & EQUITY (SAFE-T)

This Simple Agreement for Future Tokens & Equity ("SAFE-T") is entered into on ${date}, by and between:

PARTIES:
1. ${partyA} ("Company")
2. ${partyB} ("Purchaser")

1. INVESTMENT PURPOSE & PRE-VALUATION
Purchaser provides capital investment to Company for business expansion, product buildout, and token ecosystem development under the following core terms:
"${terms}"

2. FUTURE CONVERSION EVENTS
Upon the occurrence of an Equity Financing Event, Token Generation Event (TGE), or Liquidity Event prior to the expiration of ${termYears} year(s), Company shall issue to Purchaser preferred shares or utility tokens in accordance with the agreed conversion formula.

3. REPRESENTATIONS & WARRANTIES
Purchaser represents that it has knowledge and experience in financial and web3 matters, is acquiring this instrument for investment purposes, and understands the risks involved.

4. GOVERNING LAW
This SAFE-T shall be governed by and construed under the laws of ${jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this SAFE-T agreement.

________________________________________
Company: ${partyA}
Date: ${date}

________________________________________
Purchaser: ${partyB}
Date: ${date}

--------------------------------------------------------------------------------
DOCUMENT INTEGRITY VERIFICATION SIGNATURE: [SHA256:${hash}]
INFORMATIONAL TEMPLATE ONLY • NOT LEGAL ADVICE • NLA TEMPLATES`;
}
