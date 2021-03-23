import { useState, useEffect } from 'react';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
// eslint-disable-next-line import/no-cycle
import __ from '../../../../../utils/Translations';

export default function useFunctionalities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    restApiRequest(
      COMPANY_MANAGEMENT_SERVICE,
      '/get-functionalities',
      'GET',
      {},
      mockData,
    )
      .then((resData) => {
        const parsedData = Object.keys(resData)
          .map((key) => ({
            label: resData[key].label,
            className: 'py-1',
            tooltip: resData[key].description ? {
              content: resData[key].description,
              type: 'info',
              placement: 'top',
            } : null,
            value: key,
          }));
        setData(parsedData);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy funkcjonalności'), 'error'));
  }, []);
  return data;
}

const mockData = {
  TO_CHANGE: {
    label: 'możliwość wpisania danych dzieci przy płatności ZFŚS lub Travelplanet',
    description: '',
  },
  ENABLE_SHOW_ORGANIZATION_UNITS: {
    label: 'wyświetlenie jednostek organizacyjnych na raportach',
    description: 'Dla raportu płacowego – zawężonego oraz raportu socjalnego kolumna wyświetlana jest zawsze',
  },
  EMPLOYER_PAID_BENEFITS: {
    label: 'świadczenia płatne przez pracodawcę',
    description: '',
  },
  INTERNATIONALIZATION: {
    label: 'możliwość zmiany wersji językowej systemu',
    description: '',
  },
  ENABLE_PREMIUM_COMPANY: {
    label: 'system premiowy (firma)',
    description: '',
  },
  ENABLE_PREMIUM_COMPANY_EMPLOYEE: {
    label: 'system premiowy (pracownik)',
    description: '',
  },
  ALTERNATIVE_START_PAGE_OVERRIDE: {
    label: 'zawsze pokazuj alternatywną stronę główną w pomocniczym oknie wyboru',
    description: '',
  },
  SHOW_EMPLOYEE_NAME_IN_SUPPLIER: {
    label: 'wyświetlaj kolumny imię i nazwisko pracownika w Portalu Dostawcy',
    description: '',
  },
  ENABLE_PESEL: {
    label: 'włącz PESEL w encji pracownika',
    description: '',
  },
  ENABLE_WORK_PLACE: {
    label: 'włącz MP w encji pracownika',
    description: '',
  },
  ENABLE_COST_PLACE: {
    label: 'włącz MPK w encji pracownika',
    description: '',
  },
  ENABLE_OBLIGATORY_ORGANIZATION_UNITS: {
    label: 'pole "jednostka organizacyjna" jest obligatoryjne przy zakładaniu i edycji pracownika',
    description: '',
  },
  ENABLE_BANKS_LOCKING: {
    label: 'możliwość blokowania banków jednorazowych',
    description: '',
  },
  COMPANY_EVENTS: {
    label: 'włącz imprezy firmowe',
    description: '',
  },
  ENABLE_POINTS_BANKS_VISIBILITY_RESTRICTION: {
    label: 'Uprawnienia doładowań banków dla Ahr',
    description: '',
  },
  ENABLE_RESIGN_UNDISTRIBUTED_POINTS: {
    label: 'możliwość rezygnacji z nierozdysponowanych punktów',
    description: '',
  },
  DISABLE_RESIGN_UNDISTRIBUTED_POINTS: {
    label: 'zablokowanie możliwości rezygnacji z nierozdysponowanych punktów',
    description: '',
  },
  ENABLE_SHOW_RENTABLE_GROUPS: {
    label: 'wyświetlenie grup dochodowości na raportach',
    description: 'Dla raportu płacowego – zawężonego oraz raportu socjalnego kolumna wyświetlana jest zawsze.',
  },
  SHOW_WORK_PLACE_ON_REPORTS: {
    label: 'wyświetlanie MP na raporcie płacowym oraz kart-przystąpień',
    description: '',
  },
  SHOW_COST_PLACE_ON_REPORTS: {
    label: 'wyświetlanie MPK na raporcie płacowym, kart-przystąpień oraz wybranych benefitów',
    description: '',
  },
  TO_CHANGE_1: {
    label: 'możliwość rezygnacji z nierozdysponowanych punktów',
    description: '',
  },
  ADD_PREFIX_TO_MAIL: {
    label: 'dodawanie przedrostków e-mailom podczas dezaktywacji kont pracowników, czyszczenie prywatnych e-maili podczas ponownej aktywacji kont',
    description: '',
  },
  POSTPONE_ACTIVATION_AND_MAIL: {
    label: 'wstrzymywanie aktywacji konta pracownika',
    description: '',
  },
  PAYROLL_REPORT_V2: {
    label: 'włącz raport płacowy v2 - bank opłacany "z góry" pokazywany jako "z dołu"',
    description: '',
  },
  ENABLE_MESSAGE_FEED: {
    label: 'włącz komunikację AHR -> Pracownicy',
    description: '',
  },
};
