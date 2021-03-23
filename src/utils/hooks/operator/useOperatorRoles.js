import { useState, useEffect } from 'react';
import { OPERATOR_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import { mockData } from '../../../Pages/User/Role/List';
import __ from '../../Translations';

export default function useOperatorRoles(asOption = false, idAsIri = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    restApiRequest(
      OPERATOR_MANAGEMENT_SERVICE,
      '/operator-roles',
      'GET',
      {
        params: {
          itemsPerPage: 10000,
        },
      },
      mockData,
    )
      .then((resData) => {
        if (idAsIri) {
          setData(resData.map((el) => ({ ...el, id: `${IRI_PREFIX}/${el.id}` })));
        } else {
          setData(resData);
        }
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy grup operatorów'), 'error'));
  }, [idAsIri]);

  if (!asOption) {
    return data;
  }
  return data.map(({ id, name }) => ({ value: id, label: name }));
}

export const IRI_PREFIX = '/api/operator-management/v1/rest/operator-roles';
