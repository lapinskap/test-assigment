import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import Form from '../../../../../Components/Form';
import {
  employeeRentableGroupSelectionWindowPermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import {
  ACTIVATION_MODE_PERIODICALLY,
  ACTIVATION_MODE_RANGE,
  activationModeOptions,
  windowTypeOptions,
} from '../utils/consts';
import { LAYOUT_ONE_COLUMN, LAYOUT_TWO_COLUMNS } from '../../../../../Components/Layouts';
import {
  parseRentableGroupSelectionWindowDataFromBackend,
  parseRentableGroupSelectionWindowDataToBackend,
} from '../utils/utils';
import EmployeesTable from './employeesTable';
import PeriodicModeForm from './periodicModeForm';

export default function Edit({ match }) {
  const { windowId, companyId } = match.params;
  const isNew = windowId === '-1';
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [isFetched, setIsFetched] = useState(false);
  const listingUrl = `/company/edit/${companyId}/employee-management/rentable-group-selection-windows`;
  const companyName = useCompanyName();

  const history = useHistory();
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  };
  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    setIsFetched(isNew);
  }, [isNew, windowId]);

  const submit = async () => {
    try {
      const res = await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/rentable-group-selection-windows' : `/rentable-group-selection-windows/${windowId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: parseRentableGroupSelectionWindowDataToBackend({
            companyId,
            ...data,
          }),
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zapisano okno wyboru grupy dochodowości.'));
      if (isNew) {
        history.push(`/company/edit/${companyId}/employee-management/rentable-group-selection-windows/${res.id}`);
      } else {
        const newData = parseRentableGroupSelectionWindowDataFromBackend(res);
        setData({ ...newData });
        setOriginalData({ ...newData });
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy wyboru okna dochodowości'), 'error');
    }
  };

  const additionalValidation = () => {
    if (data.activationMode === ACTIVATION_MODE_PERIODICALLY && !data?.periodicallyMonths?.length) {
      setErrors({ periodicallyMonths: __('To pole jest wymagane') });
      return false;
    }

    return true;
  };
  const validateField = (field, error) => {
    if (!error && !errors) {
      return;
    }
    const currentErrors = errors ? { ...errors } : {};
    if (error) {
      currentErrors[field] = error;
    } else {
      delete currentErrors[field];
    }
    setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
  };

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading={isNew
            ? `Tworzenie okna wyboru grupy dochodowości dla firmy ${companyName}`
            : `Edycja  okna wyboru grupy dochodowości ${originalData.name || ''} (ID: ${windowId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie grupy dochodowości'
            : `Edycja grupy dochodowości ${originalData.name || ''} (ID: ${windowId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/employee-management` },
            { title: 'Lista okien wyboru grup dochodowości', link: listingUrl },
          ]}
          pushToHistory={!isNew}
        />
        <DataLoading
          fetchedData={isFetched}
          isNew={isNew}
          service={EMPLOYEE_MANAGEMENT_SERVICE}
          updateData={(res) => {
            setIsFetched(true);
            const newData = parseRentableGroupSelectionWindowDataFromBackend(res);
            setData({ ...newData });
            setOriginalData({ ...newData });
          }}
          mockDataEndpoint="/company/rentableGroupSelectionWindow/edit"
          endpoint={`/rentable-group-selection-windows/${windowId}`}
        >
          <Form
            id="rentableGroupForm"
            data={data || {}}
            config={
                      {
                        additionalValidation,
                        title: isNew ? 'Tworzenie okna wyboru grupy dochodowości' : 'Edycja okna wyboru grupy dochodowości',
                        stickyTitle: true,
                        buttons: [
                          {
                            size: 'lg',
                            color: 'success',
                            className: 'mr-2',
                            text: 'Zapisz',
                            id: 'rentableGroupFormSubmit',
                            permission: employeeRentableGroupSelectionWindowPermissionWrite,
                            type: 'submit',
                          },
                        ],
                        onSubmit: submit,
                        defaultOnChange: onChange,
                        formGroups: [
                          {
                            title: 'Dane  podstawowe',
                            formElements: [
                              {
                                id: 'name',
                                label: 'Nazwa:',
                                type: 'text',
                                validation: [{
                                  method: 'minLength',
                                  args: [3],
                                }],
                                tooltip: {
                                  content: (
                                    <>
                                      {__('Nazwa okna nie jest obowiązkowa. Służy tylko do celów identyfikacyjnych.')}
                                      {' '}
                                      <br />
                                      {__('W przypadku nie podania wartości, zostanie ona wygenerowana automatycznie.')}
                                    </>
                                  ),
                                },
                              },
                              {
                                id: 'active',
                                label: 'Aktywne',
                                type: 'boolean',
                              },
                              {
                                id: 'newEmployee',
                                label: 'Rodzaj pracownika:',
                                type: 'radio',
                                validation: ['required'],
                                options: [
                                  {
                                    label: 'Nowy pracownik',
                                    value: 'true',
                                  },
                                  {
                                    label: 'Istniejący',
                                    value: 'false',
                                  },
                                ],
                              },
                              {
                                layout: LAYOUT_ONE_COLUMN,
                                border: [ACTIVATION_MODE_RANGE, ACTIVATION_MODE_PERIODICALLY].includes(data.activationMode),
                                formElements: [
                                  {
                                    id: 'activationMode',
                                    label: 'Typ aktywacji:',
                                    type: 'radio',
                                    validation: ['required'],
                                    options: activationModeOptions,
                                  },
                                  {
                                    id: 'rangeDate',
                                    type: 'dateRange',
                                    onChange: onRangeChange,
                                    validation: ['rangeRequiredBoth'],
                                    depends: {
                                      field: 'activationMode',
                                      value: ACTIVATION_MODE_RANGE,
                                    },
                                  },
                                  {
                                    component: <PeriodicModeForm
                                      key="periodicMode"
                                      months={data.periodicallyMonths}
                                      days={data.periodicallyDays}
                                      onChange={onChange}
                                      errorMessage={errors?.periodicallyMonths}
                                      validateField={validateField}
                                    />,
                                    depends: {
                                      field: 'activationMode',
                                      value: ACTIVATION_MODE_PERIODICALLY,
                                    },
                                  },
                                ],
                              },
                              {
                                id: 'windowType',
                                label: 'Typ okna:',
                                type: 'radio',
                                validation: ['required'],
                                options: windowTypeOptions,
                              },
                            ],
                          },
                          {
                            title: 'Funkcjonalności dodatkowe',
                            formElements: [
                              {
                                id: 'defaultGroupOnEnd',
                                type: 'boolean',
                                isCheckbox: true,
                                label: 'Na zakończenie tego okna przypisz automatycznie domyślną grupę dochodowości',
                              },
                              {
                                layout: LAYOUT_TWO_COLUMNS,
                                border: Boolean(data.sendingEmails),
                                formElements: [
                                  {
                                    id: 'sendingEmails',
                                    type: 'boolean',
                                    isCheckbox: true,
                                    label: 'Wyślij e-mail X dni przed zakończeniem typu okna',
                                  },
                                  {
                                    id: 'daysSendEmailBeforeEnd',
                                    type: 'text',
                                    valueFormatter: 'integer',
                                    suffix: 'dni',
                                    validation: ['required'],
                                    depends: {
                                      field: 'sendingEmails',
                                      value: true,
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            title: 'Grupy pracownicze:',
                            formElements: [
                              {
                                id: 'employeeGroups',
                                type: 'autocompleteMultiselect',
                                options: employeeGroups,
                              },
                            ],
                          },
                        ],
                      }
                  }
          />
          <EmployeesTable
            key="adminsTable"
            data={data?.employees || []}
            companyId={companyId}
            isNew={isNew}
            update={(value) => {
              onChange('employees', value);
            }}
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
