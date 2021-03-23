import { useState, useEffect } from 'react';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useBenefitCategories(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (noFetching) {
      setData([]);
      return;
    }

    const params = {
      itemsPerPage: 10000,
    };
    if (filterField && filterValue) {
      params[filterField] = filterValue;
    }
    restApiRequest(
      SUBSCRIPTION_MANAGEMENT_SERVICE,
      '/benefit-categories',
      'GET',
      { params },
      mockBenefitCategoriesData,
    )
      .then((resData) => {
        let result = resData;
        if (idAsIri) {
          result = result.map((el) => ({ ...el, id: `${IRI_PREFIX}/${el.id}` }));
        }
        if (asOption) {
          result = result.map(({ name, id }) => ({ value: id, label: name }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy kategorii abonamentowych'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/subscription-management/v1/rest/benefit-categories';

export const mockBenefitCategoriesData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Kategoria 1',
    active: true,

  },
  {
    id: 'ce4325e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Podkategoria 3',
    active: false,
  },
  {
    id: 'bd3275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Podkategoria 4',
    active: false,
  },
  {
    id: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Podkategoria 1',
    active: true,
  },
  {
    id: 'c43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Podkategoria 2',
    active: true,
  },
];
