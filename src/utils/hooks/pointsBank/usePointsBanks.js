import { useState, useEffect } from 'react';
import { restApiRequest, COMPANY_MANAGEMENT_SERVICE } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function usePointsBanks(
  asOption = false,
  filterField = null,
  filterValue = null,
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
    restApiRequest(
      COMPANY_MANAGEMENT_SERVICE,
      '/points-banks/company',
      'GET',
      { params },
      mockData,
    )
      .then((resData) => {
        let result = resData;
        if (asOption) {
          result = result.map(({ name, id }) => ({ value: id, label: name }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy banków punktów'), 'error'));
  }, [filterField, filterValue, asOption, noFetching]);

  return data;
}

export const mockData = [
  { id: '8b7c0b23-2795-4816-ab59-5f4f1f430dea', name: 'Bank Premiowy' },
  { id: 'a58f8674-3356-453b-9e74-14d1f6583c54', name: 'Bank imprez' },
  { id: '3132623f-483c-4855-b971-28b6efb7c5a2', name: 'Bank punktów na turystykę' },
  { id: 'efd908fd-d20d-4d00-bc59-ca0561c7bd67', name: 'Reklamacje-marketing' },
  { id: 'ad90a48b-d75f-4f5e-b216-1bcd15f56e0b', name: 'Prezent świąteczny 2017' },
  { id: '4c1bbbc4-045c-4852-8daf-7c5409ef994b', name: 'Bank punktów' },
];
