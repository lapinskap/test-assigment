import { useState, useEffect } from 'react';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useOrganizationUnits(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
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
      '/organization-units',
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
          result = result.map(({ name, id }) => ({ value: id, label: name }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać jednostek organizacyjnych'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/employee-management/v1/rest/organization-units';

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    name: 'Jednostka główna',
    language: 'pl',
    description: 'Opis jednostki testowej',
    ahrGroups: [
      'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      'a43275e4-eeb2-11ea-adc1-0242ac1200022',
      'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    ],
    availableAdministrators: [
      'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      'a43275e4-eeb2-11ea-adc1-0242ac1200022',
      'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    ],
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    name: 'Jednostka regionalna',
    language: 'pl',
    description: 'Opis jednostki testowej',
    ahrGroups: [
      'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      'a43275e4-eeb2-11ea-adc1-0242ac1200022',
      'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    ],
    availableAdministrators: [
      'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      'a43275e4-eeb2-11ea-adc1-0242ac1200022',
      'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    ],
  },
];
