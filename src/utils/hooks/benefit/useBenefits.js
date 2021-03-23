import { useState, useEffect } from 'react';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';
import mockBenefitsData from '../../../Pages/Company/Products/Subscriptions/utils/mockBenefitsData';

export default function useBenefits(
  asOption = false,
  filterField = null,
  filterValue = null,
  // todo: zmienic sposób przekazania parametrów, z typem object nie działa poprawnie
  secondFilterField = null,
  secondFilterValue = null,
  idAsIri = false,
  noFetching = false,
) {
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
    if (secondFilterField && secondFilterValue) {
      params[secondFilterField] = secondFilterValue;
    }
    restApiRequest(
      SUBSCRIPTION_MANAGEMENT_SERVICE,
      '/benefits',
      'GET',
      { params },
      mockBenefitsData,
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
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy abonamentów'), 'error'));
  }, [filterField, filterValue, secondFilterField, secondFilterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/subscription-management/v1/rest/benefits';
