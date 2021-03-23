import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Form from '../../../../../../Components/Form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import useRentableGroups from '../../../../../../utils/hooks/company/useRentableGroups';
import {
  employeeEmployeeGroupPermissionWrite,
  employeeEmployeePermissionRead,
} from '../../../../../../utils/RoleBasedSecurity/permissions';
import AdminsTable from './adminsTable';
import { getUserConfirmationPopup } from '../../../../../../Components/UserConfirmationPopup';
import { clearRentableGroupAssignment } from '../../../GroupsRentable/utils';

export default function General({
  // eslint-disable-next-line no-unused-vars
  groupId, setIsEdited, isNew, listingUrl, companyId,
}) {
  const [data, updateData] = useState(isNew ? {} : null);
  const [originalData, updateOriginalData] = useState({});
  const history = useHistory();
  const rentableGroups = useRentableGroups(true, 'companyId', companyId, true, !companyId);
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  };
  const submit = async () => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/employee-groups' : `/employee-groups/${groupId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
            companyId,
          },
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zapisano grupę pracowniczą'));
      setIsEdited(false);
      if (isNew) {
        history.push(listingUrl);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy pracowniczą'), 'error');
    }
  };

  return (
    <DataLoading
      fetchedData={isNew || data !== null}
      isNew={isNew}
      service={EMPLOYEE_MANAGEMENT_SERVICE}
      updateData={(updatedData) => {
        updateData(updatedData);
        updateOriginalData(updatedData);
      }}
      mockDataEndpoint="/company/employeeGroups/edit"
      endpoint={`/employee-groups/${groupId}`}
    >
      <Form
        id="EmployeeGroupForm"
        data={data || {}}
        config={
                    {
                      title: isNew ? 'Tworzenie grupy pracowników' : `Edycja grupy pracowniczej ${originalData.name}`,
                      stickyTitle: true,
                      buttons: [
                        !isNew ? {
                          size: 'lg',
                          color: 'danger',
                          className: 'mr-2',
                          text: 'Czyszczenie wyboru grupy dochodowości',
                          id: 'clearAssignment',
                          onClick: () => {
                            getUserConfirmationPopup(
                              // eslint-disable-next-line max-len
                              __('Uwaga! ta zmiana spowoduje usunięcie wszystkich wyborów grup dochodowości przez pracowników należących do tej grupy pracowniczej.'),
                              (confirm) => confirm && clearRentableGroupAssignment(companyId, groupId),
                              __('Czy na pewno chcesz usunąć powiązania?'),
                            );
                          },
                        } : null,
                        {
                          size: 'lg',
                          color: 'light',
                          className: 'mr-2',
                          text: 'Wróć',
                          id: 'EmployeeGroupFormBack',
                          onClick: () => {
                            history.push(listingUrl);
                          },
                        },
                        isNew ? null : {
                          size: 'lg',
                          color: 'info',
                          className: 'mr-2',
                          text: 'Lista pracowników',
                          id: 'EmployeeGroupFormList',
                          permission: employeeEmployeePermissionRead,
                          href: `/company/edit/${companyId}/employee-management/employees?employeeGroup=${groupId}`,
                        },
                        {
                          size: 'lg',
                          color: 'success',
                          className: 'mr-2',
                          text: 'Zapisz',
                          id: 'EmployeeGroupFormSubmit',
                          permission: employeeEmployeeGroupPermissionWrite,
                          type: 'submit',
                        },
                      ],
                      onSubmit: submit,
                      defaultOnChange: onChange,
                      formGroups: [
                        {
                          title: 'Dane podstawowe grupy',
                          formElements: [
                            {
                              id: 'name',
                              dataOldSk: 'name',
                              label: 'Nazwa grupy:',
                              type: 'text',
                              validation: ['required', {
                                method: 'minLength',
                                args: [3],
                              }],
                            },
                            {
                              id: 'active',
                              dataOldSk: 'active',
                              label: 'Aktywna',
                              type: 'boolean',
                            },
                          ],
                        },
                        {
                          title: 'Grupy dochodowości',
                          formElements: [
                            {
                              id: 'defaultRentableGroup',
                              dataOldSk: 'defaultRentableGroup',
                              label: 'Domyślna grupa dochodowości dla tej grupy pracowników:',
                              type: 'select',
                              options: rentableGroups,
                            },
                          ],
                        },
                        {
                          title: 'Abonamenty',
                          formElements: [
                            {
                              id: 'subscriptionEmployerMaxPaidAmount',
                              dataOldSk: 'paidAmount',
                              label: 'Kwota abonamentu opłacana przez pracodawcę:',
                              type: 'text',
                              valueFormatter: 'float',
                              suffix: 'PLN',
                              validation: ['required'],
                            },
                            {
                              id: 'alternativeStartPageDisabled',
                              dataOldSk: 'alternativeStartPageDisabled',
                              label: 'Nie pokazuj strony alternatywnej abonamentówki',
                              type: 'boolean',
                            },
                          ],
                        },
                        {
                          title: 'Przypisanie administratorów',
                          formElements: [
                            {
                              component: <AdminsTable
                                key="adminsTable"
                                data={data?.administrators || []}
                                companyId={companyId}
                                update={(value) => {
                                  onChange('administrators', value);
                                }}
                              />,
                            },
                          ],
                        },
                      ],
                    }
        }
      />
    </DataLoading>
  );
}

General.propTypes = {
  groupId: PropTypes.string,
  isNew: PropTypes.bool,
  listingUrl: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  setIsEdited: PropTypes.func,
};

General.defaultProps = {
  groupId: null,
  isNew: false,
  setIsEdited: () => null,
};
