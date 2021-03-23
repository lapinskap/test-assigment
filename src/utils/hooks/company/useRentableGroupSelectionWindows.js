import { useState, useEffect } from 'react';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useRentableGroupSelectionWindow(
  asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false,
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
    restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/rentable-group-selection-windows',
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
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać okien wyboru grup dochodowości grup dochodowości'), 'error'));
  }, [filterField, filterValue, idAsIri, asOption, noFetching]);

  return data;
}

export const IRI_PREFIX = '/api/employee-management/v1/rest/rentable-group-selection-windows';

export const mockData = [
  {
    id: '10561964-5283-4e58-a80e-1306e194836d',
    companyId: '36185a41-92b6-4fe6-ad52-2ec8af80f971',
    active: true,
    name: 'Dolor.',
    newEmployee: true,
    windowType: 'popup',
    activationMode: 'periodically',
    periodicallyMonths: [
    ],
    periodicallyDays: [
    ],
    rangeDateFrom: '2020-01-06T00:00:00+00:00',
    rangeDateTo: '2020-01-06T00:00:00+00:00',
    defaultGroupOnEnd: true,
    sendingEmails: true,
    daysSendEmailBeforeEnd: 21,
    employeeGroups: [],
    employees: [],
  },
  {
    id: '19d0c1a5-bf4b-4b14-b019-67b98f6a5ba1',
    companyId: '36185a41-92b6-4fe6-ad52-2ec8af80f971',
    active: true,
    name: 'Culpa.',
    newEmployee: true,
    windowType: 'profile',
    activationMode: 'range',
    periodicallyMonths: [],
    periodicallyDays: [],
    rangeDateFrom: '2006-10-17T00:00:00+00:00',
    rangeDateTo: '2017-08-19T00:00:00+00:00',
    defaultGroupOnEnd: false,
    sendingEmails: false,
    daysSendEmailBeforeEnd: 0,
    employeeGroups: [],
    employees: [],
  },
];
