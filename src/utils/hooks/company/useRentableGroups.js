import { useState, useEffect } from 'react';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useRentableGroups(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
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
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/rentable-groups',
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
          result = result.map(({ frontendName, id }) => ({ value: id, label: frontendName }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać grup dochodowości'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/employee-management/v1/rest/rentable-groups';

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    frontendName: 'Grupa I (do 2500 PLN)',
    employeeGroups: ['a43275e4-eeb2-11ea-adc1-0242ac1200021'],
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    frontendName: 'Grupa II (od 2500 PLN do 4000 PLN)',
    employeeGroups: ['a43275e4-eeb2-11ea-adc1-0242ac1200021', 'a43275e4-eeb2-11ea-adc1-0242ac1200022'],
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    frontendName: 'Grupa III (od 40000 PLN do 5500 PLN)',
    employeeGroups: ['a43275e4-eeb2-11ea-adc1-0242ac1200023'],
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200024',
    frontendName: 'Grupa IV (powyżej 5500 PLN)',
    employeeGroups: [],
  },
];
