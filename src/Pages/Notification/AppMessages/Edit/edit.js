import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../../Components/Form';
import {
  NOTIFICATION_SERVICE, restApiRequest,
} from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import useEmployeeGroups from '../../../../utils/hooks/company/useEmployeeGroups';
import { getCompaniesOptionsFetchMethod, getEmployeesOptionsFetchMethod } from '../../../../Components/FormElements/Autocomplete/commonFetchMethods';
import {
  notificationAppMessagePermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';

export default function EditForm({
  company, companyScope, appMessageId, breadcrumbs, listingPath,
}) {
  const isNew = appMessageId === '-1';
  const [data, updateData] = useState(isNew ? { visibleFrom: new Date() } : null);
  const [originalData, updateOriginalData] = useState(null);
  const history = useHistory();
  const companyId = companyScope ? company : data?.companyId;
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };
  const onChangeCompany = (key, value) => {
    if (value !== data?.companyId) {
      const updatedData = { ...data };
      updatedData[key] = value;
      updatedData.employeeGroupId = null;
      updatedData.employeeId = null;
      updateData(updatedData);
    }
  };
  useEffect(() => {
    if (companyScope && data?.companyId !== company) {
      updateData({ ...data, companyId: company });
    }
  }, [company, companyScope, data]);

  const receiverScope = data ? data.receiverScope : null;
  const companyInputEnabled = !companyScope
      && [RECEIVER_SCOPE_COMPANY, RECEIVER_SCOPE_EMPLOYEE_GROUP, RECEIVER_SCOPE_EMPLOYEE].includes(receiverScope);
  const employeeGroupInputEnabled = receiverScope === RECEIVER_SCOPE_EMPLOYEE_GROUP;
  const employeeInputEnabled = receiverScope === RECEIVER_SCOPE_EMPLOYEE;

  const submit = async () => {
    try {
      const method = isNew ? 'POST' : 'PATCH';
      const path = isNew ? '/app-messages' : `/app-messages/${appMessageId}`;
      const {
        receiverScope: scope, companyId: companyUuid, employeeGroupId, employeeId, ...body
      } = data;

      await restApiRequest(
        NOTIFICATION_SERVICE,
        path,
        method,
        {
          body: {
            ...body,
            companyId: (companyInputEnabled || companyScope) ? companyUuid : null,
            employeeGroupId: employeeGroupInputEnabled ? employeeGroupId : null,
            employeeId: employeeInputEnabled ? employeeId : null,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano wiadomość'));
      if (isNew) {
        history.push(listingPath);
      } else {
        updateOriginalData({ ...data });
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać wiadomości'), 'error');
    }
  };
  const formData = data || {};
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
        heading={isNew ? 'Nowa wiadomość' : `Edycja wiadomości${originalData ? ` ${originalData.subject} (ID: ${originalData.id})` : ''}`}
        breadcrumbs={breadcrumbs}
        pushToHistory={!isNew}
      />
      <DataLoading
        service={NOTIFICATION_SERVICE}
        fetchedData={data !== null}
        updateData={(res) => {
          const updatedData = { ...res, receiverScope: getReceiverScope(res) };
          updateData(updatedData);
          updateOriginalData(updatedData);
        }}
        endpoint={`/app-messages/${appMessageId}`}
        mockDataEndpoint="/app-messages/edit"
        isNew={isNew}
      >
        <Form
          id="appMessageForm"
          data={{
            ...formData,
            companyId: companyInputEnabled ? formData.companyId : null,
            employeeGroupId: employeeGroupInputEnabled ? formData.employeeGroupId : null,
            employeeId: employeeInputEnabled ? formData.employeeId : null,
          }}
          config={
            {
              title: isNew ? 'Nowa wiadomość' : 'Edycja wiadomości',
              stickyTitle: true,
              onSubmit: submit,
              buttons: [
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  href: listingPath,
                  id: 'appMessageBack',
                },
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'appMessageSubmit',
                  permission: notificationAppMessagePermissionWrite,
                },
              ],
              defaultOnChange: onChange,
              formGroups: [
                {
                  title: 'Dane',
                  formElements: [

                    {
                      id: 'receiverScope',
                      label: 'Odbiorca wiadomości',
                      type: 'radio',
                      validation: ['required'],
                      options: companyScope ? receiverCompanyScopeOptions : receiverScopeOptions,
                    },
                    {
                      id: 'companyId',
                      label: 'Firma:',
                      validation: companyInputEnabled ? ['required'] : null,
                      type: 'asyncAutocomplete',
                      onChange: onChangeCompany,
                      fetchOptions: getCompaniesOptionsFetchMethod(data ? data.companyId : null),
                      props: {
                        disabled: !companyInputEnabled,
                      },
                      displayCondition: !companyScope,
                    },
                    {
                      id: 'employeeGroupId',
                      label: 'Grupa pracownicza:',
                      type: 'autocomplete',
                      validation: employeeGroupInputEnabled ? ['required'] : null,
                      props: {
                        disabled: !(data && data.companyId) || !employeeGroupInputEnabled,
                      },
                      tooltip: {
                        content: __('Aby pojawiły się dostępne opcje najpierw należy wybrać firmę'),
                      },
                      options: employeeGroups,
                    },
                    {
                      id: 'employeeId',
                      label: 'Pracownik:',
                      type: 'asyncAutocomplete',
                      validation: employeeInputEnabled ? ['required'] : null,
                      props: {
                        disabled: !(data && data.companyId) || !employeeInputEnabled,
                      },
                      tooltip: {
                        content: __('Aby pojawiły się dostępne opcje najpierw należy wybrać firmę'),
                      },
                      fetchOptions: getEmployeesOptionsFetchMethod(data?.employeeId, { companyId: data?.companyId }),
                    },
                    {
                      id: 'subject',
                      label: 'Tytuł:',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'message',
                      label: 'Zawartość:',
                      type: 'wysiwyg',
                      validation: ['required'],
                    },
                    {
                      id: 'visibleFrom',
                      label: 'Wyświetlaj od:',
                      type: 'date',
                      showTimeSelect: true,
                    },
                    {
                      id: 'createdAt',
                      label: 'Data utworzenia:',
                      type: 'date',
                      showTimeSelect: true,
                      displayCondition: !isNew,
                      props: {
                        disabled: true,
                      },
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

export const RECEIVER_SCOPE_ALL = 'all';
export const RECEIVER_SCOPE_COMPANY = 'company';
export const RECEIVER_SCOPE_EMPLOYEE_GROUP = 'employeeGroup';
export const RECEIVER_SCOPE_EMPLOYEE = 'employee';

const receiverCompanyScopeOptions = [
  { value: RECEIVER_SCOPE_COMPANY, label: 'Wszyscy pracownicy wybranej firmy' },
  { value: RECEIVER_SCOPE_EMPLOYEE_GROUP, label: 'Wszyscy pracownicy wybranej grupy pracowniczej' },
  { value: RECEIVER_SCOPE_EMPLOYEE, label: 'Wybrany pracownik' },
];

const receiverScopeOptions = [
  { value: RECEIVER_SCOPE_ALL, label: 'Wszyscy pracownicy w systemie' },
  ...receiverCompanyScopeOptions,
];
export const getReceiverScope = (object) => {
  let scope = RECEIVER_SCOPE_ALL;
  if (object.employeeId) {
    scope = RECEIVER_SCOPE_EMPLOYEE;
  } else if (object.employeeGroupId) {
    scope = RECEIVER_SCOPE_EMPLOYEE_GROUP;
  } else if (object.companyId) {
    scope = RECEIVER_SCOPE_COMPANY;
  }
  return scope;
};

EditForm.propTypes = ({
  company: PropTypes.string,
  companyScope: PropTypes.bool,
  appMessageId: PropTypes.string.isRequired,
  listingPath: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
});
EditForm.defaultProps = ({
  company: null,
  companyScope: false,
});
