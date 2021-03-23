import { useEffect, useState } from 'react';
import useBusinessCategories from '../../../utils/hooks/catalog/useBusinessCategories';
import { CATEGORY_TYPE_PRODUCT } from '../BusinessCategory/Tree/utils';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';

export const LOCALIZATION_TYPE_ADDRESS = 'loc1';
export const LOCALIZATION_TYPE_CITIES = 'loc2';
export const LOCALIZATION_TYPE_OVERRIDING = 'loc3';
export const OVERRIDING_LOCATION_FIELD = 'parentLocation';

export const parseDataToBackend = ({
  city, zipcode, street, codesCountVisibility, codesCountVisibilityCustom, showAgreements, agreementsData, fieldsData, ...data
}) => {
  const codesCountVisibilityParsed = codesCountVisibility;
  const fieldsDataParsed = fieldsData.map((item) => ({
    ...item, fieldType: item.isCustom ? item.code : item.fieldType, code: undefined, isCustom: item.isCustom ? item.isCustom : undefined,
  }));

  return {
    ...data,
    // exemptFromTaxes: Boolean(data.exemptFromTaxes === '1'),
    configurableProduct: Boolean(data.configurableProduct === '1'),
    configurationsData: data.configurationsData ? data.configurationsData
      .filter((item) => !item.id)
      .map((item) => ({
        ...item,
        marketPrice: item.marketPrice ? Number.parseFloat(item.marketPrice).toFixed(2) : undefined,
        purchasePrice: item.purchasePrice ? Number.parseFloat(item.purchasePrice).toFixed(2) : undefined,
        sellingPrice: item.sellingPrice ? Number.parseFloat(item.sellingPrice).toFixed(2) : undefined,
      }))
      : undefined,
    blockTime: data.blockTime != null || data.blockTime === '' ? +data.blockTime : undefined,
    sellingPrice: data.sellingPrice ? String(data.sellingPrice) : null,
    purchasePrice: data.purchasePrice ? String(data.purchasePrice) : null,
    marketPrice: data.marketPrice ? String(data.marketPrice) : null,
    codesCountVisibility: codesCountVisibilityParsed,
    agreementsData: showAgreements ? agreementsData : [],
    fieldsData: fieldsDataParsed,
  };
};

export const parseDataFromBackend = ({
  codesCountVisibility, configurations, configurationsData, fieldsData, ...restData
}) => {
  const codesCountVisibilityParsed = codesCountVisibility;
  const fieldsDataParsed = fieldsData.map((item) => ({
    ...item,
    fieldType: item.isCustom ? 'newValue' : item.fieldType,
    code: item.isCustom ? item.fieldType : undefined,
  }));

  return {
    ...restData,
    codesCountVisibility: codesCountVisibilityParsed,
    codesCountVisibilityCustom: codesCountVisibility,
    configurableProduct: restData.configurableProduct ? '1' : '0',
    locationType: restData.locationType || 'null',
    configurationsData: configurations || configurationsData,
    showAgreements: Boolean(restData.agreementsData?.length),
    fieldsData: fieldsDataParsed,
    // exemptFromTaxes: restData.exemptFromTaxes ? '1' : '0',
  };
};

export const isUniqueProductId = async (identifier, businessId) => {
  try {
    const res = await restApiRequest(
      CATALOG_MANAGEMENT_SERVICE,
      '/products',
      'GET',
      {
        params: { identifier },
      },
      [],
    );
    const otherItems = res.filter(({ id }) => id !== businessId);
    return otherItems.length === 0;
  } catch (e) {
    console.error(e);
  }
  return true;
};

export const useCategoryOptions = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const businessCategories = useBusinessCategories(false, 'type', 'product', true);
  useEffect(() => {
    const result = businessCategories.filter(({ type }) => type === CATEGORY_TYPE_PRODUCT).map(({ breadcrumbs, id, name }) => {
      const labelElements = breadcrumbs.map(({ name: categoryName }) => categoryName);
      labelElements.push(name);
      return {
        value: id,
        label: labelElements.join(CATEGORIES_SEPARATOR),
      };
    }).sort((a, b) => {
      if (a.label < b.label) { return -1; }
      if (a.label > b.label) { return 1; }
      return 0;
    });
    setCategoryOptions(result);
  }, [businessCategories]);

  return categoryOptions;
};
export const CATEGORIES_SEPARATOR = ' > ';

export const formatDate = (value) => {
  const isValid24hTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);
  if (!isValid24hTime) {
    const [time, modifier] = value.split(' ');

    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:00`;
  }

  return `${value}:00`;
};
