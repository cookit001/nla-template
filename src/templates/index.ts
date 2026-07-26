import { LegalTemplateInputs } from '@/types';
import { fillNdaTemplate } from './nda';
import { fillSowTemplate } from './sow';
import { fillAdvisoryTemplate } from './advisory';
import { fillContractorTemplate } from './contractor';
import { fillSafeTemplate } from './safe';

export { fillNdaTemplate } from './nda';
export { fillSowTemplate } from './sow';
export { fillAdvisoryTemplate } from './advisory';
export { fillContractorTemplate } from './contractor';
export { fillSafeTemplate } from './safe';

export function renderLegalTemplate(inputs: LegalTemplateInputs): string {
  switch (inputs.documentType) {
    case 'sow':
      return fillSowTemplate(inputs);
    case 'advisory':
      return fillAdvisoryTemplate(inputs);
    case 'contractor':
      return fillContractorTemplate(inputs);
    case 'safe':
      return fillSafeTemplate(inputs);
    case 'nda':
    default:
      return fillNdaTemplate(inputs);
  }
}
