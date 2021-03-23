import { useState, useEffect } from 'react';
import { OPERATOR_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import { mockData } from '../../../Pages/User/Operator/List';
import __ from '../../Translations';

// export default function useOperatorRoles(asOption = false, idAsIri = false) {
export default function useOperators(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
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
      OPERATOR_MANAGEMENT_SERVICE,
      '/operators',
      'GET',
      { params },
      mockData,
    )
      .then((resData) => {
        let result = resData;
        if (idAsIri) {
          result = result.map((el) => ({ ...el, id: `${IRI_PREFIX}/${el.id}` }));
        }
        if (asOption) {
          result = result.map(({
            id, firstName, lastName, username,
          }) => ({ value: id, label: `${firstName} ${lastName} (${username})` }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy operatorów'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/operator-management/v1/rest/operators';
