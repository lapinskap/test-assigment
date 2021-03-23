import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { IRI_PREFIX, mockData } from '../../../../../../utils/hooks/company/useRentableGroupSelectionWindows';
import { getIdFromIri } from '../../../../../../utils/jsHelpers/iriConverter';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';

export const fetchRentableGroupSelectionWindow = async (iris) => {
  try {
    const ids = iris.map((iri) => getIdFromIri(iri, IRI_PREFIX));
    return restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/rentable-group-selection-windows',
      'GET',
      { params: { id: ids } },
      mockData,
    );
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się pobrać listy okien wyboru grup dochodowości'), 'error');
    return [];
  }
};

export const saveRentableGroupSelectionWindow = async (employeeId, windowsData, individualWindowsEnabled) => {
  const promises = [];
  windowsData.forEach(({ enabled, ...windowData }) => {
    if (enabled && individualWindowsEnabled) {
      promises.push(saveWindow(employeeId, windowData));
    } else {
      promises.push(deleteWindow(windowData.id));
    }
  });
  return Promise.all(promises);
};

const deleteWindow = async (id) => {
  try {
    if (id) {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/rentable-group-selection-windows/${id}`,
        'DELETE',
        { returnNull: true },
        null,
      );
    }
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się odłączyć okna wyboru grupy dochodowości'), 'error');
  }
};

const saveWindow = async (employeeId, windowData) => {
  try {
    if (windowData.id) {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/rentable-group-selection-windows/${windowData.id}`,
        'PATCH',
        {
          body: { ...windowData },
        },
        {},
      );
    } else {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/rentable-group-selection-windows/individual/${employeeId}`,
        'POST',
        {
          body: { ...windowData },
        },
        {},
      );
    }
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się zapisać okna wyboru grupy dochodowości'), 'error');
  }
};
