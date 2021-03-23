import React, { useState, useCallback } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';

import Form from '../../../../../../Components/Form';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import useAhrs from '../../../../../../utils/hooks/company/useAhrs';
import sortAlphabetically from '../../../../../../utils/jsHelpers/sortAlphabetically';
import { employeeAhrRolePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';
import PageTitle from '../../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../../routerHelper';
import { useCompanyName } from '../../../../CompanyContext';
import Permissions from './permissions';
import FormTable from './formTable';

export default function AhrGroupsForm({ match }) {
  const history = useHistory();
  const companyName = useCompanyName();
  const { companyId, id } = match.params;
  const isNew = id === '-1';
  const [data, updateData] = useState(null);
  const [originalData, updateOriginalData] = useState({});
  const [alreadyFetched, setAlreadyFetched] = useState(false);
  const administrators = useAhrs(true, 'companyId', companyId, true, !companyId);
  const listingUrl = `/company/edit/${companyId}/employee-management/ahr#ahr_role`;

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      const body = { ...data, companyId };
      let roleChanged = false;
      if (!isNew) {
        const previousPermissions = [...originalData.permissions].map(({ scope, code }) => `${scope}${code}`).sort(sortAlphabetically).join(';');
        const newPermissions = [...body.permissions].map(({ scope, code }) => `${scope}${code}`).sort(sortAlphabetically).join(';');
        roleChanged = previousPermissions !== newPermissions;
      }
      const res = await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/ahr-roles' : `/ahr-roles/${id}`,
        isNew ? 'POST' : 'PATCH',
        {
          body,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zapisano rolę'));
      if (roleChanged) {
        dynamicNotification(__('Zmiana uprawnień będzie widoczna przy ponownym zalogowaniu użytkowników z tą rolą'), 'warning');
      }
      if (isNew) {
        history.push(listingUrl);
      } else {
        updateOriginalData(res);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać roli'), 'error');
    }
  };
  return (
    <>
      <PageTitle
        heading={isNew ? 'Dodawanie nowej roli AHR' : `Edycja roli ${originalData.name}`}
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          {
            title: 'Zarządzanie pracownikami',
            link: `/company/edit/${companyId}/employee-management`,
          },
          {
            title: 'Role AHR',
            link: `/company/edit/${companyId}/employee-management/ahr#ahr_role`,
          },
        ]}
        pushToHistory
        historyElementType="edit"
      />
      <DataLoading
        service={EMPLOYEE_MANAGEMENT_SERVICE}
        fetchedData={isNew || alreadyFetched}
        updateData={(updatedData) => {
          updateData({ ...updatedData });
          updateOriginalData({ ...updatedData });
          setAlreadyFetched(true);
        }}
        endpoint={`/ahr-roles/${id}`}
        mockDataEndpoint="/company/ahrGroups/edit"
      >
        <Form
          id="ahrRoleForm"
          data={data || {}}
          config={{
            title: isNew ? 'Dodawanie nowej roli AHR' : `Edycja roli ${originalData.name}`,
            defaultOnChange: onChange,
            onSubmit: submit,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                permission: employeeAhrRolePermissionWrite,
                type: 'submit',
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    id: 'name',
                    dataOldSk: 'name',
                    label: 'Nazwa',
                    type: 'text',
                    validation: ['required'],
                  },
                  {
                    id: 'description',
                    dataOldSk: 'description',
                    label: 'Opis',
                    type: 'textarea',
                    validation: ['required'],
                  },
                  {
                    component: <FormTable administrators={administrators} />,
                    displayCondition: !isNew,
                    key: 'ahrRoleId',
                  },
                ],
              },
              {
                formElements: [
                  {
                    component: <Permissions
                      key="permissions"
                      selectedPermissions={data?.permissions || []}
                      updateFormData={onChange}
                      role="ahr"
                    />,
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </>
  );
}

AhrGroupsForm.propTypes = {
  match: matchPropTypes.isRequired,
};
