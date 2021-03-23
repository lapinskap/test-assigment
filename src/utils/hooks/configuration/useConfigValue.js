import { useEffect, useState } from 'react';
import { CONFIGURATION_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

const useConfigValue = (path, companyId = null, employeeGroupId = null) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const params = { path };
    if (companyId) {
      params.companyId = companyId;
    }
    if (employeeGroupId) {
      params.employeeGroupId = employeeGroupId;
    }

    restApiRequest(
      CONFIGURATION_SERVICE,
      '/get-config-value',
      'GET',
      {
        params,
      },
      'mockConfigValue',
    )
      .then((res) => setValue(res))
      .catch((e) => {
        console.error(e);
        dynamicNotification(e.message || __('Nie udało się pobrać danych konfiguracyjnych'), 'error');
      });
  }, [path, companyId, employeeGroupId]);

  return value;
};

export default useConfigValue;
