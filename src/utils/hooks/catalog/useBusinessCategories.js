import { useState, useEffect } from 'react';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useBusinessCategories(asOption = false, filterField = null, filterValue = null, idAsIri = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let url = '/business-categories?itemsPerPage=10000';
    if (filterField && filterValue) {
      url += `&${filterField}=${filterValue}`;
    }
    restApiRequest(
      CATALOG_MANAGEMENT_SERVICE,
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
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy kategorii biznesowych'), 'error'));
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
    name: 'Educkacja',
    active: true,
    type: 'product',
    activeFrom: '2020-02-12T00:00:00+00:00',
    activeTo: '2020-02-12T00:00:00+00:00',
    helpCenterUrl: '/test/example',
    breadcrumbs: [],
    position: 1,
  },
  {
    id: '7105a40b-a629-4035-a79e-f1b7c6c50ea2',
    name: 'Sklepy',
    active: true,
    activeFrom: '2020-02-12T00:00:00+00:00',
    activeTo: '2020-02-12T00:00:00+00:00',
    helpCenterUrl: '/test/example',
    breadcrumbs: [
      { id: '7105a40b-a629-4035-a79e-f1b7c6c50ea8', name: 'Edukacja' },
    ],
    position: 1,
  },
  {
    id: '7105a40b-a629-4035-a79e-f1b7c6c50ea3',
    name: 'Książki',
    active: true,
    type: 'product',
    activeFrom: '2020-02-12T00:00:00+00:00',
    activeTo: '2020-02-12T00:00:00+00:00',
    helpCenterUrl: '/test/example',
    breadcrumbs: [
      { id: '7105a40b-a629-4035-a79e-f1b7c6c50ea8', name: 'Educkacja' },
      { id: '7105a40b-a629-4035-a79e-f1b7c6c50ea2', name: 'Sklepy' },
    ],
    position: 1,
  },
  {
    id: '7105a40b-a629-4035-a79e-f1b7c6c50ea4',
    name: 'Kultura',
    active: true,
    type: 'product',
    activeFrom: '2020-02-12T00:00:00+00:00',
    activeTo: '2020-02-12T00:00:00+00:00',
    helpCenterUrl: '/test/example',
    breadcrumbs: [],
    position: 1,
  },
];

export const IRI_PREFIX = '/api/catalog-management/v1/rest/business-categories';
