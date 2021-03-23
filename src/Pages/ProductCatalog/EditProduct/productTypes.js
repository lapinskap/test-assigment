export const SHOPS_PRODUCT_TYPE = 'shops';
export const GASTRONOMY_PRODUCT_TYPE = 'gastronomy';
export const TRANSPORT_PRODUCT_TYPE = 'transport';
export const EDUCATION_PRODUCT_TYPE = 'education';
export const CULTURE_PRODUCT_TYPE = 'culture';
export const RECREATION_PRODUCT_TYPE = 'recreation';
export const INTEGRATION_PRODUCT_TYPE = 'integration';
export const PREPAID_PRODUCT_TYPE = 'prepaid';
export const BENEFIT_LUNCH_PRODUCT_TYPE = 'benefit_lunch';
export const FUNDING_PRODUCT_TYPE = 'funding';
export const APPLICATION_PRODUCT_TYPE = 'application';
export const CARD_PRODUCT_TYPE = 'card';
export const TOURISM_ABROAD_PRODUCT_TYPE = 'tourism_abroad';
export const TOURISM_ABROAD_OTHER_PRODUCT_TYPE = 'international_tourism_other';
export const TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE = 'international_tourism_travelplanet';
export const EMPTY_PRODUCT_TYPE = 'empty';
export const UNIVERSAL_CODES_PRODUCT_TYPE = 'universal_codes';

export const universalCodeTypes = [{
  label: 'Sklepy',
  id: SHOPS_PRODUCT_TYPE,
  icon: 'pe-7s-cart',
},
{
  label: 'Gastronomia',
  id: GASTRONOMY_PRODUCT_TYPE,
  icon: 'pe-7s-coffee',
},
{
  label: 'Transport',
  id: TRANSPORT_PRODUCT_TYPE,
  icon: 'pe-7s-car',
},
{
  label: 'Edukacja',
  id: EDUCATION_PRODUCT_TYPE,
  icon: 'pe-7s-study',
},
{
  label: 'Kultura',
  id: CULTURE_PRODUCT_TYPE,
  icon: 'pe-7s-bookmarks',
},
{
  label: 'Rekreacja',
  id: RECREATION_PRODUCT_TYPE,
  icon: 'pe-7s-sun',
}];

export const internationalTourismCodeTypes = [
  {
    label: 'Travelplanet',
    id: TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE,
    icon: 'pe-7s-world',
  }, {
    label: 'Inne',
    id: TOURISM_ABROAD_OTHER_PRODUCT_TYPE,
    icon: 'pe-7s-world',
  },
];

export const productTypes = [{
  label: 'Kody uniwersalne',
  id: UNIVERSAL_CODES_PRODUCT_TYPE,
  icon: 'pe-7s-edit',
},
{
  label: 'Integracje',
  id: INTEGRATION_PRODUCT_TYPE,
  icon: 'pe-7s-users',
},
{
  label: 'Karty przedpłacone',
  id: PREPAID_PRODUCT_TYPE,
  icon: 'pe-7s-credit',
},
{
  label: 'BenefitLunch',
  id: BENEFIT_LUNCH_PRODUCT_TYPE,
  icon: 'pe-7s-coffee',
},
{
  label: 'Dofinansowania',
  id: FUNDING_PRODUCT_TYPE,
  icon: 'pe-7s-cash',
},
{
  label: 'Wnioski',
  id: APPLICATION_PRODUCT_TYPE,
  icon: 'pe-7s-note2',
},
{
  label: 'Karty plastikowe',
  id: CARD_PRODUCT_TYPE,
  icon: 'pe-7s-id',
},
{
  label: 'Turystyka zagraniczna',
  id: TOURISM_ABROAD_PRODUCT_TYPE,
  icon: 'pe-7s-world',
},
{
  label: 'Pusty Szablon',
  id: EMPTY_PRODUCT_TYPE,
  icon: 'pe-7s-box2',
}];
