import { useState, useEffect } from 'react';
// import {  MASTERDATA_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useBillingUnits(companyId, asOption = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!companyId) {
      return;
    }
    // restApiRequest(
    //   MASTERDATA_SERVICE,
    //   `/units-of-account?companyId=${companyId}`,
    //   'GET',
    //   {},
    //   mockData,
    // )
    new Promise((resolve) => {
      dynamicNotification('Pobrane jednoski rozliczeniowe są danymi mockowymi, czekamy na dostarczenie Api', 'warning');
      resolve(mockData);
    })
      .then((resData) => {
        let result = resData;

        if (asOption) {
          result = result.map(({ name, id }) => ({ value: id, label: name }));
        }
        setData(result);
      })
      .catch((e) => {
        console.error(e);
        dynamicNotification(__('Nie udało się połączyć z serwisem jednostek rozliczeniowych, skontatkuj się z serwisem'), 'error');
      });
  }, [companyId, asOption]);

  return data;
}

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    name: 'Główna jednostka',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Jednostka lokalna',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    name: 'Jednostka oddziału warszawskiego',
  },
];
