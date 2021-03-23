import { useState, useEffect } from 'react';
import {
  EMPLOYEE_MANAGEMENT_SERVICE,
  OPERATOR_MANAGEMENT_SERVICE,
  restApiRequest,
} from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useRolePermissions(role) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let service;
    switch (role) {
      case 'omb':
        service = OPERATOR_MANAGEMENT_SERVICE;
        break;
      case 'ahr':
        service = EMPLOYEE_MANAGEMENT_SERVICE;
        break;
      default:
        service = null;
    }

    if (!service) {
      return;
    }

    restApiRequest(
      service,
      '/aggregated-permissions',
      'GET',
      {
        params: {
          itemsPerPage: 10000,
        },
      },
      mockData,
    )
      .then((resData) => {
        setData(resData);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy uprawnień'), 'error'));
  }, [role]);

  return data;
}

export const mockData = [
  {
    role: 'omb',
    code: 'permission-code-1',
    label: 'Podgląd jednostek organizacyjnych',
    groupLabel: 'Pracownicy',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-2',
    label: 'Zarządzanie jednostkami organizacyjnymi',
    groupLabel: 'Pracownicy',
    scope: 'employee',
    require: ['employee:permission-code-1', 'employee:permission-code-3'],
  },
  {
    role: 'omb',
    code: 'permission-code-3',
    label: 'Podgląd grup dochodowości',
    groupLabel: 'Pracownicy',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-4',
    label: 'Zarządzanie grupami dochodowości',
    groupLabel: 'Pracownicy',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-5',
    label: 'Podgląd jednostek organizacyjnych',
    groupLabel: 'Firma',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-6',
    label: 'Zarządzanie jednostkami organizacyjnymi',
    groupLabel: 'Firma',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-7',
    label: 'Podgląd grup dochodowości',
    groupLabel: 'Firma',
    scope: 'employee',
  },
  {
    role: 'omb',
    code: 'permission-code-8',
    label: 'Zarządzanie grupami dochodowości',
    groupLabel: 'Firma',
    scope: 'employee',
  },
];
