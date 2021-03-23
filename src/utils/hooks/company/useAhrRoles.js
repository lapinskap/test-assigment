import { useState, useEffect } from 'react';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useAhrRoles(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (noFetching) {
      setData([]);
      return;
    }

    const params = { ahr: true, itemsPerPage: 10000 };
    if (filterField && filterValue) {
      params[filterField] = filterValue;
    }
    restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/ahr-roles',
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
          result = result.map(({ id, name }) => ({ value: id, label: name }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy ról AHR'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/employee-management/v1/rest/ahr-roles';

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    name: 'AHR_MAX_test',
    description: 'grupa AHR_MAX',
    employeeIds: ['1a43275e4-eeb2-11ea-adc1-0242ac120002', '2a43275e4-eeb2-11ea-adc1-0242ac120002'],
  },
];
