import PropTypes from 'prop-types';
import SelectCategory from './step1';
import BasicInfo from './step2';
import RulesOfRealization from './step3';
import Prices from './step4';
import AttachmentsAndLinks from './step5';
import Summary from './step6';
import TourismBasicInfo from './CustomSteps/tourismStep2';
import TourismRulesOfRealization from './CustomSteps/tourismStep3';
import {
  TOURISM_ABROAD_PRODUCT_TYPE,
  TOURISM_ABROAD_OTHER_PRODUCT_TYPE,
  TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE,
} from './productTypes';

export default function getDefaultSteps(
  type, isNew, productId,
) {
  let productSteps;

  switch (type) {
    case TOURISM_ABROAD_PRODUCT_TYPE:
    case TOURISM_ABROAD_OTHER_PRODUCT_TYPE:
    case TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE:
      productSteps = [
        {
          key: 'general', name: 'Podstawowe informacje', Component: TourismBasicInfo, props: { productId },
        },
        {
          key: 'config', name: 'Konfiguracja', Component: TourismRulesOfRealization, props: { productId },
        },
      ];
      break;
    default:
      productSteps = [
        {
          key: 'general', name: 'Podstawowe informacje', Component: BasicInfo, props: { productId },
        },
        {
          key: 'config', name: 'Konfiguracja', Component: RulesOfRealization, props: { productId },
        },
        {
          key: 'prices', name: 'Ceny i dostępności', Component: Prices, props: { productId },
        },
        {
          key: 'forms', name: 'Formularze i zgody', Component: AttachmentsAndLinks, props: { productId },
        },
      ];
  }
  productSteps[productSteps.length - 1].submit = true;
  if (isNew) {
    productSteps.unshift({
      key: 'category',
      name: 'Wybór typu',
      Component: SelectCategory,
    });
    productSteps.push({
      name: 'Podsumowanie', key: 'summary', Component: Summary, props: { type }, blockSteps: true,
    });
  }

  return productSteps;
}

getDefaultSteps.propTypes = {
  selectedProduct: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  productId: PropTypes.number.isRequired,
  updateSelectedProduct: PropTypes.func.isRequired,
};
