import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';

// eslint-disable-next-line import/prefer-default-export
export const clearRentableGroupAssignment = async (companyId, employeeGroupId = undefined) => {
  try {
    await restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees/clear/rentable-group',
      'PATCH',
      {
        body: {
          employeeGroupId, companyId,
        },
      },
    );
    dynamicNotification(__('Pomyślnie usunięto wybory grup pracowniczych'));
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się usunąć wyboru grup dochodowości'), 'error');
  }
};
