import {
  TOURISM_ABROAD_PRODUCT_TYPE,
  TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE,
  TOURISM_ABROAD_OTHER_PRODUCT_TYPE,
} from './productTypes';
import { CODES_VISIBILITY_NEVER, PRODUCT_TYPE_BENEFIT } from './consts';

export default function getDefaultData(selectedProduct) {
  const defaultData = {
    configurableProduct: '0',
    codesCountVisibility: CODES_VISIBILITY_NEVER,
    configurationJson: [{}],
  };
  switch (selectedProduct) {
    case TOURISM_ABROAD_PRODUCT_TYPE:
    case TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE:
    case TOURISM_ABROAD_OTHER_PRODUCT_TYPE:
      defaultData.benefitCost = 'fromEmployee';
      // defaultData.mbBenefitType = PRODUCT_TYPE_TOURISM;
      defaultData.mbBenefitType = PRODUCT_TYPE_BENEFIT;
      defaultData.codesCountVisibility = null;
      break;
    default:
  }

  return defaultData;
}
