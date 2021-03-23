import { useState, useEffect } from 'react';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';
import mockGroupsData from '../../../Pages/Company/Products/Subscriptions/utils/mockGroupsData';

export default function useBenefitGroups(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
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
      '/benefit-groups',
      'GET',
      { params },
      mockGroupsData,
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
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy grup abonamentów'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);
  return data;
}

export const IRI_PREFIX = '/api/subscription-management/v1/rest/benefit-groups';
