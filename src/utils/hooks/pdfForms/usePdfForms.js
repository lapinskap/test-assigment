import { useState, useEffect } from 'react';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function usePdfForms(asOption = false, filterField = null, filterValue = null, idAsIri = false, noFetching = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (noFetching) {
      return;
    }

    let url = '/pdf-forms?itemsPerPage=10000';
    if (filterField && filterValue) {
      url += `&${filterField}=${filterValue}`;
    }
    restApiRequest(
      SUBSCRIPTION_MANAGEMENT_SERVICE,
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
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy formularzy PDF'), 'error'));
  }, [filterField, filterValue, idAsIri, noFetching]);

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
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    withBarcode: true,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    withBarcode: false,
  },
];

export const IRI_PREFIX = '/api/subscription-management/v1/rest/pdf-forms';
