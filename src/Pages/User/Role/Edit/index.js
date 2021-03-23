import React, { useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../../Components/Form';
import { OPERATOR_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import sortAlphabetically from '../../../../utils/jsHelpers/sortAlphabetically';
import { operatorOperatorPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import Permissions from '../../../Company/EmployeeManagement/CompanyAhr/Forms/AhrRoles/permissions';

const listingPath = '/user/role';
export default function Edit({ match }) {
  const { roleId } = match.params;
  const isNew = roleId === '-1';
  const [data, updateData] = useState(isNew ? {} : null);
  const [originalData, updateOriginalData] = useState(null);
  const history = useHistory();
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };
  const submit = async () => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const path = isNew ? '/operator-roles' : `/operator-roles/${roleId}`;
      const body = { ...data };
      let roleChanged = false;
      if (!isNew) {
        const previousPermissions = [...originalData.permissions].map(({ scope, code }) => `${scope}${code}`).sort(sortAlphabetically).join(';');
        const newPermissions = [...body.permissions].map(({ scope, code }) => `${scope}${code}`).sort(sortAlphabetically).join(';');
        roleChanged = previousPermissions !== newPermissions;
      }
      const response = await restApiRequest(
        OPERATOR_MANAGEMENT_SERVICE,
        path,
        method,
        {
          body,
        },
        body,
      );
      dynamicNotification(__('Pomyślnie zapisano rolę operatorów'));
      if (roleChanged) {
        dynamicNotification(__('Zmiana uprawnień będzie widoczna przy ponownym zalogowaniu użytkowników z tą rolą'), 'warning');
      }
      if (isNew) {
        history.push(listingPath);
      } else {
        updateOriginalData({ ...response });
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać roli operatorów'), 'error');
    }
  };

  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        pushToHistory={!isNew}
        heading={isNew ? 'Nowa rola' : `Edycja roli${originalData ? ` ${originalData.name} (ID: ${originalData.id})` : ''}`}
        breadcrumbs={[
          {
            title: 'Operatorzy MB',
            link: '/user',
          },
          {
            title: 'Lista ról',
            link: listingPath,
          }]}
      />
      <DataLoading
        service={OPERATOR_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => {
          updateData({ ...updatedData });
          updateOriginalData({ ...updatedData });
        }}
        endpoint={`/operator-roles/${roleId}`}
        mockDataEndpoint="/user/roles/edit"
        isNew={isNew}
      >
        <Form
          id="operatorRoleForm"
          data={data || {}}
          config={
            {
              title: isNew ? 'Nowa rola' : 'Edycja roli',
              stickyTitle: true,
              buttons: [
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  href: listingPath,
                },
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  permission: operatorOperatorPermissionWrite,
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  title: 'Dane',
                  formElements: [
                    {
                      id: 'name',
                      label: 'Nazwa',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'description',
                      label: 'Opis',
                      type: 'textarea',
                      validation: ['required'],
                    },
                  ],
                },
                {
                  title: 'Zestaw uprawnień dla funkcjonalności OMB',
                  formElements: [
                    {
                      component: <Permissions
                        key="permissions"
                        selectedPermissions={data?.permissions || []}
                        updateFormData={onChange}
                        role="omb"
                      />,
                    },
                  ],
                },
              ],
            }
          }
        />
      </DataLoading>
    </CSSTransitionGroup>
  );
}

Edit.propTypes = ({
  match: matchPropTypes.isRequired,
});
