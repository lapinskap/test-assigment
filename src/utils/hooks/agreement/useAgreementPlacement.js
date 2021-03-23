import { useState, useEffect } from 'react';
import { AGREEMENT_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useAgreementPlacement(asOption = false) {
  const [data, setData] = useState([]);

  useEffect(() => {
    restApiRequest(
      AGREEMENT_SERVICE,
      '/get-placements',
      'GET',
      {},
      mockData,
    )
      .then((rowData) => {
        const responseData = [];
        Object.keys(rowData).forEach((key) => {
          responseData.push({ id: key, label: rowData[key] });
        });

        if (!asOption) {
          setData(responseData);
        } else {
          setData(responseData.map(({ id, label }) => ({ value: id, label })));
        }
      })

      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy lokalizacji zgód'), 'error'));
  }, [asOption]);

  return data;
}

const mockData = {
  1: 'Warstwa powitalna',
  2: 'Zgody dostawców (świadczenia abonamentowe)',
  3: 'Zgody klientów (świadczenia abonamentowe)',
  4: 'Podsumowanie e-commerce',
  5: 'Logowanie SSO',
};
