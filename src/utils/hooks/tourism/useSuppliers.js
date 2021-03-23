import { useState, useEffect } from 'react';
import { MASTERDATA_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useSuppliers(asOption = false, filterField = null, filterValue = null, idAsIri = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let url = '/supplierobject/touristic';
    if (filterField && filterValue) {
      url += `?${filterField}=${filterValue}`;
    }
    restApiRequest(
      MASTERDATA_SERVICE,
      url,
      'GET',
      {},
      mockData,
    )
      .then((resData) => {
        if (idAsIri) {
          setData(resData.map((el) => ({ ...el, id: `${IRI_PREFIX}/${el.id}` })));
        } else {
          setData(resData);
        }
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy dostawców'), 'error'));
  }, [filterField, filterValue, idAsIri]);

  if (!asOption) {
    return data;
  }
  return data.map(({ name, id }) => ({
    value: id,
    label: name,
  }));
}

const mockData = [
  {
    id: '7105a40b-a629-4035-a79e-f1b7c6c50ea8',
    name: 'ANIXE',
    active: true,
    activeFrom: '2020-02-12T00:00:00+00:00',
    activeTo: '2020-02-12T00:00:00+00:00',
    helpCenterUrl: '/test/example',
    position: 1,
  },
];

export const IRI_PREFIX = '/api/tourism/v1/rest/tourism-suppliers';
