// eslint-disable-next-line import/prefer-default-export
import {
  EMPLOYEE_GROUP_METHOD_CO_FINANCED,
  EMPLOYEE_GROUP_METHOD_EMPLOYEE,
  EMPLOYEE_GROUP_METHOD_EMPLOYER, EMPLOYEER_PRICE_TYPE_CHOICE, EMPLOYEER_PRICE_TYPE_FIXED, EMPLOYEER_PRICE_TYPE_HIDDEN,
} from '../EditBenefit/utils';

export const DEFAULT_SETTING_GROUP = 'default';

export const benefitMethodOptions = [
  {
    value: EMPLOYEE_GROUP_METHOD_EMPLOYER,
    label: 'pracodawca',
  },
  {
    value: EMPLOYEE_GROUP_METHOD_EMPLOYEE,
    label: 'pracownik',
  },
  {
    value: EMPLOYEE_GROUP_METHOD_CO_FINANCED,
    label: 'współfinansowany z pracodawcą',
  },
];

export const employerPriceTypeOptions = [
  {
    label: 'stały',
    value: EMPLOYEER_PRICE_TYPE_FIXED,
  },
  {
    label: 'nie pokazuj kosztu pracodawcy',
    value: EMPLOYEER_PRICE_TYPE_HIDDEN,
  },
  {
    label: 'koszt wybierany przez pracownika',
    value: EMPLOYEER_PRICE_TYPE_CHOICE,
  },
];
