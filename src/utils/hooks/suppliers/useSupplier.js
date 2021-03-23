import { useState, useEffect } from 'react';
import { MASTERDATA_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';
import { mockData } from '../../../Pages/Tourism/listOfSuppliers/table';

export default function useSupplier(
  id = null,
) {
  const [data, setData] = useState(null);

  useEffect(() => {
    restApiRequest(
      MASTERDATA_SERVICE,
      `/supplierobject/nontouristic/${id}`,
      'GET',
      {},
      mockData[0],
    )
      .then((resData) => {
        setData(resData);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać dostawcy'), 'error'));
  }, [id]);

  return data;
}
