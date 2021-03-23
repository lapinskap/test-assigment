import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import useEmployeeGroups from '../../../../../../utils/hooks/company/useEmployeeGroups';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import { employeeRentableGroupPermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';

export default function General({
  groupId, setIsEdited, isNew, listingUrl, companyId,
}) {
  const [data, updateData] = useState(null);
  const history = useHistory();
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

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
        isNew ? '/rentable-groups' : `/rentable-groups/${groupId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
            companyId,
          },
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zapisano grupę dochodowości'));
      setIsEdited(false);
      if (isNew) {
        history.push(listingUrl);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy dochodowości'), 'error');
    }
  };

  return (
    <DataLoading
      fetchedData={isNew || data !== null}
      isNew={isNew}
      service={EMPLOYEE_MANAGEMENT_SERVICE}
      updateData={(updatedData) => updateData(updatedData)}
      mockDataEndpoint="/company/rentableGroup/edit"
      endpoint={`/rentable-groups/${groupId}`}
    >
      <Form
        id="rentableGroupForm"
        data={data || {}}
        config={
                    {
                      title: isNew ? 'Tworzenie grupy dochodowości' : 'Edycja grupy dochodowości',
                      stickyTitle: true,
                      buttons: [
                        {
                          size: 'lg',
                          color: 'light',
                          className: 'mr-2',
                          text: 'Wróć',
                          id: 'rentableGroupFormBack',
                          onClick: () => {
                            history.push(listingUrl);
                          },
                        },
                        {
                          size: 'lg',
                          color: 'success',
                          className: 'mr-2',
                          text: 'Zapisz',
                          id: 'rentableGroupFormSubmit',
                          permission: employeeRentableGroupPermissionWrite,
                          type: 'submit',
                        },
                      ],
                      onSubmit: submit,
                      defaultOnChange: onChange,
                      formGroups: [
                        {
                          title: 'Dane grupy dochodowości',
                          formElements: [
                            {
                              id: 'reportName',
                              label: 'Nazwa w raportach:',
                              type: 'text',
                              validation: ['required', {
                                method: 'minLength',
                                args: [3],
                              }],
                            },
                            {
                              id: 'frontendName',
                              dataOldSk: 'frontendName',
                              label: 'Nazwa dla pracownika:',
                              type: 'text',
                              validation: ['required', {
                                method: 'minLength',
                                args: [3],
                              }],
                            },
                            {
                              id: 'employeeGroups',
                              type: 'checkbox',
                              label: 'Dostępność w grupach:',
                              options: employeeGroups,
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
  groupId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  listingUrl: PropTypes.string.isRequired,
  setIsEdited: PropTypes.func,
};

General.defaultProps = {
  setIsEdited: () => null,
  isNew: false,
};
