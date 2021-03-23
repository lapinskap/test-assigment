import { useEffect, useState } from 'react';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';

// eslint-disable-next-line import/prefer-default-export
export const useBankData = (bankId) => {
  const [result, setResult] = useState({});

  useEffect(() => {
    restApiRequest(
      COMPANY_MANAGEMENT_SERVICE,
      '/points-bank',
      'GET',
      {
        params: {
          pointsBankId: bankId,
        },
      },
      mockData,
    ).then((res) => setResult(res))
      .catch((e) => {
        console.error(e);
        dynamicNotification(e.message || __('Nie udało się pobrać danych o banku punktów'), 'error');
      });
  }, [bankId]);

  return result;
};

const mockData = {
  pointsBankId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
  name: 'Bank premierowy',
};
