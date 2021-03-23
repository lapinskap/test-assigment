import { useState, useEffect } from 'react';
import { MASTERDATA_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import { mockData } from '../../../Pages/Tourism/listOfSuppliers/table';
import __ from '../../Translations';

export default function useSuppliers(asOption = false, touristic = false, idToLowercase = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    restApiRequest(
      MASTERDATA_SERVICE,
      touristic ? '/supplierobject/touristic' : '/supplierobject/nontouristic',
      'GET',
      {
        params: {
          rowsPerPage: 10000,
        },
      },
      { member: mockData },
    )
      .then((resData) => {
        const { member: items } = resData;
        let result = items.filter(({ supplierBusinessID }) => supplierBusinessID);
        if (idToLowercase) {
          result = result.map((item) => ({ ...item, supplierBusinessID: item.supplierBusinessID.toLowerCase() }));
        }

        if (asOption) {
          result = result.map(({
            supplierBusinessID, objectName,
          }) => ({ value: supplierBusinessID, label: objectName }));
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy dostawców'), 'error'));
  }, [asOption, touristic, idToLowercase]);

  return data;
}
