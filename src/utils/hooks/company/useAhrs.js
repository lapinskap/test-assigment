import { useState, useEffect } from 'react';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';
import { mockData } from '../../../Pages/Company/EmployeeManagement/CompanyEmployees/List/list';

export default function useAhrs(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
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
      '/employees',
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
          result = result.map(({ firstName, lastName, id }) => ({ value: id, label: `${firstName} ${lastName}` }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy administratorów'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/employee-management/v1/rest/employees';
