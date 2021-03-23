import React, { useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../../Components/Form';
import { OPERATOR_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import PasswordPopup from './passwordPopup';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import useOperatorRoles from '../../../../utils/hooks/operator/useOperatorRoles';
import { operatorOperatorPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

const listingPath = '/user/operator';

export default function Edit({ match }) {
  const { operatorId } = match.params;
  const isNew = operatorId === '-1';

  const [data, updateData] = useState(isNew ? { active: false } : null);
  const [originalData, updateOriginalData] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const history = useHistory();
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const groups = useOperatorRoles(true, true);

  const closePasswordPopup = () => setShowPasswordPopup(false);
  const openPasswordPopup = () => setShowPasswordPopup(true);

  const submit = async () => {
    try {
      const method = isNew ? 'POST' : 'PATCH';
      const path = isNew ? '/operators' : `/operators/${operatorId}`;
      const roleChanged = !isNew && (originalData.operatorRole !== data.operatorRole);
      const response = await restApiRequest(
        OPERATOR_MANAGEMENT_SERVICE,
        path,
        method,
        {
          body: data,
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano dane operatora'));
      updateOriginalData(response);
      if (roleChanged) {
        dynamicNotification(__('Zmiana roli będzie widoczna przy ponownym zalogowaniu użytkownika.'), 'warning');
      }
      if (isNew) {
        history.push(listingPath);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać danych operatora'), 'error');
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
        heading={isNew ? 'Dodawanie operatora' : `Edycja operatora${originalData ? ` ${originalData.username} (${originalData.id})` : ''}`}
        breadcrumbs={[{ title: 'Operatorzy MB', link: '/user' }, { title: 'Lista operatorów', link: listingPath }]}
        pushToHistory
      />
      <DataLoading
        service={OPERATOR_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => {
          updateData(updatedData);
          updateOriginalData(updatedData);
        }}
        endpoint={`/operators/${operatorId}`}
        mockDataEndpoint="/user/operator/edit"
        isNew={isNew}
      >
        <Form
          id="operatorForm"
          data={data || {}}
          config={
            {
              title: isNew ? 'Dodawanie operatora' : 'Edycja operatora',
              stickyTitle: true,
              buttons: [
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  href: listingPath,
                },
                !isNew ? {
                  size: 'lg',
                  color: 'info',
                  className: 'mr-2',
                  text: 'Zmień hasło',
                  permission: operatorOperatorPermissionWrite,
                  onClick: openPasswordPopup,
                } : null,
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  permission: operatorOperatorPermissionWrite,
                  type: 'submit',
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  title: 'Dane',
                  formElements: [
                    {
                      id: 'id',
                      label: 'Identyfikator biznesowy',
                      type: 'text',
                      props: {
                        disabled: true,
                      },
                      displayCondition: !isNew,
                    },
                    {
                      id: 'firstName',
                      dataOldSk: 'firstname',
                      label: 'Imię',
                      type: 'text',
                      validation: ['required', { method: 'minLength', args: [3] }],
                    },
                    {
                      id: 'lastName',
                      dataOldSk: 'lastname',
                      label: 'Nazwisko',
                      type: 'text',
                      validation: ['required', { method: 'minLength', args: [3] }],
                    },
                    {
                      id: 'username',
                      dataOldSk: 'login',
                      label: 'Login',
                      type: 'text',
                      validation: ['required', { method: 'minLength', args: [3] }],
                    },
                    {
                      id: 'email',
                      label: 'E-mail',
                      type: 'text',
                      validation: ['email'],
                    },
                    {
                      id: 'password',
                      label: 'Hasło',
                      type: 'password',
                      validation: ['required', 'password'],
                      displayCondition: isNew,
                    },
                    {
                      id: 'password2',
                      dataOldSk: 'password2',
                      label: 'Powtórz hasło',
                      type: 'password',
                      validation: ['required', {
                        method: 'mustBeEqual',
                        args: [data && data.password, 'Hasła nie są takie same'],
                      }],
                      displayCondition: isNew,
                      props: {
                        previewToggle: false,
                      },
                    },
                    {
                      id: 'operatorRole',
                      dataOldSk: 'group',
                      label: 'Rola operatorów',
                      type: 'select',
                      options: groups,
                    },
                    {
                      id: 'active',
                      dataOldSk: 'active',
                      label: 'Aktywny',
                      type: 'boolean',
                    },
                  ],
                },
              ],
            }
          }
        />
      </DataLoading>
      {showPasswordPopup ? (
        <PasswordPopup
          close={closePasswordPopup}
          isOpen={showPasswordPopup}
          operatorId={operatorId}
          username={originalData ? originalData.username : ''}
        />
      ) : null}
    </CSSTransitionGroup>
  );
}

Edit.propTypes = ({
  match: matchPropTypes.isRequired,
});
