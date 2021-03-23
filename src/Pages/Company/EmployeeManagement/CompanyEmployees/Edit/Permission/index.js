import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import useAhrRoles from '../../../../../../utils/hooks/company/useAhrRoles';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import useEmployeeGroups from '../../../../../../utils/hooks/company/useEmployeeGroups';
import {
  employeeAhrRolePermissionWrite,
} from '../../../../../../utils/RoleBasedSecurity/permissions';
import useBillingUnits from '../../../../../../utils/hooks/company/useBillingUnits';
import useOrganizationUnits from '../../../../../../utils/hooks/company/useOrganizationUnits';
import { CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL } from '../../../../../../Components/FormElements/Checkboxes';

export default function Permission({
  active, setIsEdited, companyId, employeeId,
}) {
  const [data, updateData] = useState(null);
  const [originalData, updateOriginalData] = useState(null);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !active || !companyId);
  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, true, !active || !companyId);
  const billingUnits = useBillingUnits(companyId, true);

  const submit = async () => {
    try {
      if (!data.ahr) {
        data.ahrRole = null;
        data.administeredPointsBanks = [];
        data.administeredEmployeeGroups = [];
        data.administeredOrganizationUnits = [];
        data.administeredBillingUnits = [];
        updateData({ ...data });
      }

      const {
        ahr, ahrRole, administeredEmployeeGroups, administeredPointsBanks, administeredOrganizationUnits, administeredBillingUnits,
      } = data;

      const roleChanged = originalData && ahr && (originalData.ahrRole !== ahrRole);

      const response = await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/employees/${employeeId}`,
        'PATCH',
        {
          body: {
            ahr, ahrRole, administeredEmployeeGroups, administeredPointsBanks, administeredOrganizationUnits, administeredBillingUnits,
          },
        },
        null,
      );

      dynamicNotification(__('Pomyślnie zapisano dane operatora'));
      updateOriginalData(response);
      if (roleChanged) {
        dynamicNotification(__('Zmiana roli będzie widoczna przy ponownym zalogowaniu użytkownika.'), 'warning');
      }
      setIsEdited(false);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać uprawnień'), 'error');
    }
  };

  const ahrRoles = useAhrRoles(true, 'companyId', companyId, true, !active || !companyId);

  if (!active) {
    return null;
  }

  return (
    <DataLoading
      service={EMPLOYEE_MANAGEMENT_SERVICE}
      fetchedData={data !== null}
      updateData={(updatedData) => {
        updateData(updatedData);
        updateOriginalData(updatedData);
      }}
      endpoint={`/employees/${employeeId}`}
      mockDataEndpoint="/employee/permissions/edit"
    >
      <Form
        id="employeePermission"
        data={data || {}}
        config={{
          title: 'Uprawnienia',
          stickyTitle: true,
          onSubmit: submit,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              type: 'submit',
              id: 'employeePermissionSubmit',
              permission: employeeAhrRolePermissionWrite,
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Administracja',
              formElements: [
                {
                  id: 'ahr',
                  dataOldSk: 'admin',
                  label: 'Jest administratorem firmy',
                  type: 'boolean',
                },
                {
                  id: 'ahrRole',
                  dataOldSk: 'userGroup',
                  label: 'Rola AHR:',
                  type: 'select',
                  options: ahrRoles,
                  validation: data?.ahr ? ['required'] : [],
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                },
                {
                  id: 'administeredEmployeeGroups',
                  label: 'Wybierz grupy pracowników, których jest administratorem:',
                  type: 'checkbox',
                  options: employeeGroups,
                  props: {
                    buttons: CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL,
                  },
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                  tooltip: {
                    type: 'info',
                    content: (
                      <>
                        Administrator będzie miał dostęp tylko do pracowników
                        {' '}
                        <br />
                        z zaznaczonych grup.
                      </>
                    ),
                  },
                },
                {
                  id: 'allResourcesEmployeeGroups',
                  label: 'Administruje wszystkimi grupami pracowników w firmie',
                  type: 'boolean',
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                },
                {
                  id: 'administeredOrganizationUnits',
                  label: 'Wybierz jednostki organizacyjne, których jest administratorem:',
                  type: 'checkbox',
                  options: organizationUnits,
                  props: {
                    buttons: CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL,
                  },
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                  tooltip: {
                    type: 'info',
                    content: (
                      <>
                        Administrator będzie miał dostęp tylko do pracowników
                        {' '}
                        <br />
                        z zaznaczonych jednostek.
                      </>
                    ),
                  },
                },
                {
                  id: 'allResourcesOrganizationUnits',
                  label: 'Administruje wszystkimi jednostkami organizacyjnymi w firmie',
                  type: 'boolean',
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                },
                {
                  id: 'administeredBillingUnits',
                  label: 'Wybierz jednostki rozliczeniowe, których jest administratorem:',
                  type: 'checkbox',
                  options: billingUnits,
                  props: {
                    buttons: CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL,
                  },
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                  tooltip: {
                    type: 'info',
                    content: 'Administrator będzie miał dostęp tylko do zaznaczonych jednostek',
                  },
                },
                {
                  id: 'allResourcesBillingUnits',
                  label: 'Administruje wszystkimi jednostkami rozliczeniowymi w firmie',
                  type: 'boolean',
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                },
                {
                  id: 'administeredPointsBanks',
                  dataOldSk: 'ahrPointsBanks',
                  label: 'Wybierz banki punktów, których jest administratorem:',
                  type: 'checkbox',
                  props: {
                    buttons: CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL,
                  },
                  options: [
                    {
                      value: 'ahrPointsBanks1',
                      label: 'Bank 1',
                    },
                    {
                      value: 'ahrPointsBanks2',
                      label: 'Bank 2',
                    },
                  ],
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                  tooltip: {
                    type: 'info',
                    content: (
                      <>
                        Administrator będzie miał dostęp tylko do
                        {' '}
                        <br />
                        zaznaczonych banków punktów.
                      </>
                    ),
                  },
                },
                {
                  id: 'allResourcesPointsBanks',
                  label: 'Administruje wszystkimi bankami punktów w firmie',
                  type: 'boolean',
                  depends: {
                    value: true,
                    field: 'ahr',
                  },
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}

Permission.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  employeeId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
Permission.defaultProps = {
  active: false,
  setIsEdited: () => null,
};
