import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Alert } from 'reactstrap';
import { Loader } from 'react-loaders';
import Form from '../../../../../../Components/Form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import useOrganizationUnits from '../../../../../../utils/hooks/company/useOrganizationUnits';
import useRentableGroups from '../../../../../../utils/hooks/company/useRentableGroups';
import useEmployeeGroups from '../../../../../../utils/hooks/company/useEmployeeGroups';
import {
  DICTIONARY_PROVINCES,
} from '../../../../../../utils/hooks/dictionaries/dictionariesCodes';
import { LAYOUT_ONE_COLUMN, LAYOUT_TWO_COLUMNS } from '../../../../../../Components/Layouts';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import { useCompanyHasFunctionality } from '../../../../CompanyContext';
import DefaultTooltip from '../../../../../../Components/Tooltips/defaultTooltip';
import generatePassword from '../../../../../../utils/jsHelpers/generatePassword';
import {
  employeeEmployeePermissionWrite,
  employeeRentableGroupSelectionWindowPermissionWrite,
  ssoCanSwitchUser,
} from '../../../../../../utils/RoleBasedSecurity/permissions';
import { getUserConfirmationPopup } from '../../../../../../Components/UserConfirmationPopup';
import AppConfig from '../../../../../../config/appConfig';
import { clearSessionData } from '../../../../../../utils/RoleBasedSecurity/Session';
import { defaultLanguage } from '../../../../../../utils/Translations/translationUtils';
import {
  ACTIVATION_MODE_PERIODICALLY,
  ACTIVATION_MODE_RANGE,
  activationModeOptions, WINDOW_TYPE_ACCOUNT, WINDOW_TYPE_POPUP, windowTypeOptions,
} from '../../../RentableGroupsWindow/utils/consts';
import PeriodicModeForm from '../../../RentableGroupsWindow/Edit/periodicModeForm';
import { fetchRentableGroupSelectionWindow, saveRentableGroupSelectionWindow } from './utils';
import capitalize from '../../../../../../utils/jsHelpers/capitalize';
import useHasPermission from '../../../../../../utils/hooks/security/useHasPermission';
import useDictionariesMap from '../../../../../../utils/hooks/dictionaries/useDictionariesMap';

const dictionariesCodes = [DICTIONARY_PROVINCES];

export default function General({
  active, setIsEdited, isNew, companyId, employeeId, setEmployeeData,
}) {
  const [data, updateData] = useState(isNew ? { preferredLanguage: defaultLanguage } : null);
  const [originalData, updateOriginalData] = useState({});
  const [windowSelectionData, setWindowSelectionData] = useState([]);
  const [individualWindowsEnabled, setIndividualWindowsEnabled] = useState(false);
  const [loadingWindowSelection, setLoadingWindowSelection] = useState(false);
  const [errors, setErrors] = useState({});
  const [blockedButtons, setBlockedButtons] = useState(false);
  const [blockedActivation, setBlockedActivation] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const history = useHistory();
  const onChange = useCallback((key, value, fieldsToClear = []) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    fieldsToClear.forEach((field) => delete updatedData[field]);
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  const onChangeWindow = (key, value, type) => {
    const updatedWindowsSelectionData = [...windowSelectionData];
    let filedValue = {};
    if (key === 'rangeDate') {
      const { from, to } = value;
      filedValue = { [`${key}From`]: from, [`${key}To`]: to };
    } else {
      filedValue = { [key]: value };
    }
    const window = updatedWindowsSelectionData.find(({ windowType }) => windowType === type);
    if (window) {
      updatedWindowsSelectionData[updatedWindowsSelectionData.indexOf(window)] = { ...window, ...filedValue };
    } else {
      updatedWindowsSelectionData.push({
        windowType: type, companyId, ...filedValue, enabled: true,
      });
    }
    setIsEdited(true);
    setWindowSelectionData(updatedWindowsSelectionData);
  };

  const enableWindow = (windowsTypes) => {
    const newWindowSelectionData = [];
    [WINDOW_TYPE_ACCOUNT, WINDOW_TYPE_POPUP].forEach((type) => {
      let window = windowSelectionData.find(({ windowType }) => windowType === type);
      if (windowsTypes.includes(type)) {
        if (window) {
          window.enabled = true;
        } else {
          window = { windowType: type, enabled: true, companyId };
        }
      } else if (window) {
        window.enabled = false;
      }
      if (window) {
        newWindowSelectionData.push({ ...window });
      }
    });
    setIsEdited(true);
    setWindowSelectionData(newWindowSelectionData);
  };

  const dictionaries = useDictionariesMap(dictionariesCodes);
  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, true, !active || !companyId);
  const rentableGroups = useRentableGroups(true, 'companyId', companyId, true, !active || !companyId);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !active || !companyId);
  const mpFunctionality = useCompanyHasFunctionality('ENABLE_WORK_PLACE');
  const mpkFunctionality = useCompanyHasFunctionality('ENABLE_COST_PLACE');
  const enableOrganizationUnits = useCompanyHasFunctionality('ENABLE_OBLIGATORY_ORGANIZATION_UNITS');
  const hasAccessToSelectionWindowsWrite = useHasPermission(employeeRentableGroupSelectionWindowPermissionWrite);
  if (!active) {
    return null;
  }
  const submit = async () => {
    try {
      const response = await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/employees' : `/employees/${employeeId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
            companyId,
          },
        },
        data,
      );
      if (hasAccessToSelectionWindowsWrite) {
        await saveRentableGroupSelectionWindow(response.id, windowSelectionData, individualWindowsEnabled);
      }
      dynamicNotification(__('Pomyślnie zapisano pracownika'));
      setIsEdited(false);
      if (isNew) {
        history.push(`/company/edit/${companyId}/employee-management/employees/${response.id}`);
      } else {
        setEmployeeData(response);
        updateData(response);
        updateOriginalData(response);
        setGeneratedPassword('');
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać pracownika'), 'error');
    }
  };

  const toggleActivation = async () => {
    try {
      setBlockedActivation(true);
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/employees/${employeeId}`,
        'PATCH',
        {
          body: {
            active: !data.active,
          },
        },
        null,
      );
      dynamicNotification(data.active ? __('Pomyślnie dezaktywowano pracownika') : __('Pomyślnie aktywowano pracownika'));
      updateData({
        ...data,
        active: !data.active,
      });
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać pracownika'), 'error');
    }
    setBlockedActivation(false);
  };

  const loginAsEmployee = async () => {
    try {
      const { ok: success } = await fetch(`/signin/oauth/impersonate-user?_switch_user=${data.id}`);
      if (success) {
        clearSessionData();
        window.location = `${AppConfig.get('frontAppDomain')}?changeUser=true`;
      } else {
        throw new Error(__('Nie udało się zalogować jako pracownik'));
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message, 'error');
    }
  };

  const additionalButtons = [];

  //  TODO: take this from backend
  const userNeverLogged = true;

  if (data && !isNew) {
    additionalButtons.push(
      {
        id: 'active',
        size: 'lg',
        color: 'danger',
        className: 'mr-2',
        text: data.active ? 'Dezaktywuj' : 'Aktywuj',
        onClick: toggleActivation,
        disabled: blockedActivation,
        permission: employeeEmployeePermissionWrite,
      },
    );
    additionalButtons.push(
      {
        id: 'signIn',
        size: 'lg',
        color: 'info',
        className: 'mr-2',
        text: 'Zaloguj jako pracownik',
        disabled: !data.active,
        title: !data.active ? 'Pracownik musi być aktywny' : null,
        onClick: loginAsEmployee,
        permission: ssoCanSwitchUser,
      },
    );
    additionalButtons.push(
      {
        size: 'lg',
        id: 'print',
        color: 'info',
        className: 'mr-2',
        text: 'Drukuj list',
        onClick: () => {
          dynamicNotification('Ten przycisk jeszcze nic nie robi', 'warning');
        },
      },
    );
    if (userNeverLogged) {
      additionalButtons.push(
        {
          id: 'sendEmail',
          size: 'lg',
          color: 'info',
          className: 'mr-2',
          text: 'Wyślij e-mail',
          disabled: !originalData.businessEmail || !originalData.id || blockedButtons,
          tooltip: !originalData.businessEmail ? 'Aby wysłać sms pracownik musi mieć zapisany służbowy e-mail.' : null,
          onClick: () => sendMessageToUser(employeeId, 'mail', setBlockedButtons),
          permission: employeeEmployeePermissionWrite,
        },
      );
      additionalButtons.push(
        {
          id: 'sendSms',
          size: 'lg',
          color: 'info',
          className: 'mr-2',
          text: 'Wyślij SMS',
          permission: employeeEmployeePermissionWrite,
          disabled: !originalData.businessPhone || !originalData.id || blockedButtons,
          tooltip: !originalData.businessPhone ? 'Aby wysłać sms pracownik musi mieć zapisany służbowy numer telefonu.' : null,
          onClick: () => sendMessageToUser(employeeId, 'sms', setBlockedButtons),
        },
      );
    }
  }

  const getRentableGroupSelectionWindow = async (employeeData) => {
    const iris = [employeeData?.individualWindowAccount, employeeData?.individualWindowPopup].filter(Boolean);
    setLoadingWindowSelection(true);
    let result = [];
    if (iris.length) {
      result = await fetchRentableGroupSelectionWindow(iris);
    }
    setWindowSelectionData(result.map((item) => ({ ...item, enabled: true })));
    setIndividualWindowsEnabled(result.length > 0);
    setLoadingWindowSelection(false);
  };
  const additionalValidation = () => {
    let result = true;
    let newErrors = null;
    windowSelectionData.forEach(({ windowType, activationMode, periodicallyMonths }) => {
      if (activationMode === ACTIVATION_MODE_PERIODICALLY && !periodicallyMonths?.length) {
        result = false;
        if (!newErrors) {
          newErrors = {};
        }
        newErrors[`periodicallyMonths${capitalize(windowType)}`] = __('To pole jest wymagane');
      }
    });

    if (newErrors) {
      setErrors(newErrors);
    }

    return result;
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

  const formData = { ...(data || {}), individualWindowsEnabled };
  if (individualWindowsEnabled) {
    const windowTypes = [];
    windowSelectionData.forEach(({ windowType, enabled, ...windowData }) => {
      const windowTypePrefix = capitalize(windowType);
      if (enabled) {
        windowTypes.push(windowType);
      }
      Object.keys(windowData).forEach((key) => {
        if (['rangeDateFrom', 'rangeDateTo'].includes(key)) {
          formData[`rangeDate${windowTypePrefix}${key.replace('rangeDate', '')}`] = windowData[key];
        } else {
          formData[`${key}${windowTypePrefix}`] = windowData[key];
        }
      });
    });
    formData.windowTypes = windowTypes;
  }
  const individualSelectionWindowPopup = Boolean(formData?.windowTypes?.includes(WINDOW_TYPE_POPUP));
  const individualSelectionWindowAccount = Boolean(formData?.windowTypes?.includes(WINDOW_TYPE_ACCOUNT));
  return (
    <DataLoading
      service={EMPLOYEE_MANAGEMENT_SERVICE}
      fetchedData={isNew || data !== null}
      updateData={(result) => {
        getRentableGroupSelectionWindow(result);
        const updatedData = { ...result };
        if (!updatedData.preferredLanguage) {
          updatedData.preferredLanguage = defaultLanguage;
        }
        updateData({ ...updatedData });
        updateOriginalData({ ...updatedData });
      }}
      mockDataEndpoint="/employee/general/edit"
      endpoint={`/employees/${employeeId}`}
      isNew={isNew}
    >
      <Form
        id="employeeGeneral"
        data={formData}
        config={{
          additionalValidation,
          title: 'Dane pracownika',
          stickyTitle: true,
          onSubmit: submit,
          buttons: [
            ...additionalButtons,
            {
              id: 'submit',
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              type: 'submit',
              permission: employeeEmployeePermissionWrite,
            },
          ],
          defaultOnChange: onChange,
          columns: [
            {
              formGroups: [
                {
                  title: 'Podstawowe dane',
                  formElements: [
                    {
                      id: 'firstName',
                      label: 'Imię:',
                      validation: ['required', { method: 'minLength', args: [2] }],
                      type: 'text',
                    },
                    {
                      id: 'lastName',
                      label: 'Nazwisko:',
                      validation: ['required', { method: 'minLength', args: [2] }],
                      type: 'text',
                    },
                    {
                      id: 'username',
                      validation: ['required', { method: 'minLength', args: [5] }],
                      label: 'Login:',
                      type: 'text',
                    },
                    {
                      id: 'testUser',
                      label: 'Testowy pracownik',
                      type: 'boolean',
                    },
                    // {
                    //   id: 'personalPhone',
                    //   label: 'Numer tel. kom. (prywatny):',
                    //   type: 'text',
                    //   validation: ['phone'],
                    // },
                    {
                      id: 'businessPhone',
                      label: 'Numer tel. kom. (służbowy):',
                      type: 'text',
                      tooltip: {
                        type: 'info',
                        content: (
                          <>
                            Wpisz numer telefonu komórkowego
                            {' '}
                            <br />
                            jeśli list powitalny z loginem i hasłem do systemu,
                            {' '}
                            <br />
                            będziesz wysyłać sms-em.
                          </>
                        ),
                      },
                      validation: ['phone'],
                    },
                    // {
                    //   id: 'personalEmail',
                    //   label: 'E-mail (prywatny):',
                    //   type: 'text',
                    //   validation: ['email'],
                    // },
                    {
                      id: 'businessEmail',
                      label: 'E-mail (służbowy):',
                      type: 'text',
                      tooltip: {
                        type: 'info',
                        content: (
                          <>
                            Wpisz email
                            {' '}
                            <br />
                            jeśli list powitalny z loginem i hasłem do systemu,
                            {' '}
                            <br />
                            będziesz wysyłać e-mailowo.
                          </>
                        ),
                      },
                      validation: ['email'],
                    },
                    {
                      id: 'workPlace',
                      label: 'Miejsce wykonywania pracy:',
                      type: 'text',
                      displayCondition: mpFunctionality,
                    },
                    {
                      id: 'costPlace',
                      label: 'Miejsce powstania kosztu:',
                      type: 'text',
                      displayCondition: mpkFunctionality,
                    },
                    {
                      id: 'fk',
                      label: 'Numer pracownika w systemie kadrowo-płacowym:',
                      type: 'text',
                      validation: ['required'],

                    },
                    {
                      id: 'province',
                      label: 'Województwo:',
                      type: 'select',
                      options: dictionaries.get(DICTIONARY_PROVINCES),
                      tooltip: {
                        type: 'info',
                        content: (
                          <>
                            Województwo miejsca pracy.
                            {' '}
                            <br />
                            Potrzebne do filtrowania aktualności pokazujących się
                            pracownikowi
                            {' '}
                            <br />
                            tylko do tych z jego regionu.
                          </>
                        ),
                      },
                    },
                    {
                      id: 'personalProvince',
                      label: 'Województwo (prywatne):',
                      type: 'select',
                      options: dictionaries.get(DICTIONARY_PROVINCES),
                    },
                    // {
                    //   id: 'preferredLanguage',
                    //   label: 'Preferowany język:',
                    //   type: 'select',
                    //   options: languages,
                    // },
                    {
                      id: 'employeeGroup',
                      label: 'Grupa pracownicza:',
                      type: 'select',
                      options: employeeGroups,
                    },

                  ],
                },
              ],
            },
            {
              formGroups: [
                {
                  title: 'Grupy dochodowości pracownika',
                  formElements: [
                    {
                      id: 'rentableGroup',
                      label: 'Grupa dochodowości:',
                      type: 'select',
                      options: rentableGroups,
                    },
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      border: individualWindowsEnabled,
                      formElements: [
                        {
                          component: <Loader key="selectionsWindowLoader" active type="line-scale" style={{ transform: 'scale(0.6)' }} />,
                          displayCondition: loadingWindowSelection,
                        },
                        {
                          component: (
                            <Alert color="secondary" key="noAccessToEditSelectionWindowAlert">
                              {__('Nie masz uprawnień do edycji okien wyboru grup dochodowości')}
                            </Alert>
                          ),
                          displayCondition: !hasAccessToSelectionWindowsWrite && !loadingWindowSelection,
                        },
                        {
                          id: 'individualWindowsEnabled',
                          label: 'Włącz indywidualne okno wyboru grup dochodowości',
                          onChange: (key, value) => setIndividualWindowsEnabled(value),
                          type: 'boolean',
                          props: {
                            disabled: !hasAccessToSelectionWindowsWrite,
                          },
                          displayCondition: !loadingWindowSelection,
                        },
                        {
                          id: 'windowTypes',
                          label: 'Typ okna',
                          type: 'checkbox',
                          displayCondition: individualWindowsEnabled,
                          onChange: (key, value) => enableWindow(value),
                          validation: ['required'],
                          props: {
                            disabled: !hasAccessToSelectionWindowsWrite,
                          },
                          options: windowTypeOptions,
                        },
                        {
                          layout: LAYOUT_ONE_COLUMN,
                          border: individualSelectionWindowPopup,
                          formElements: [
                            {
                              id: 'individualWindowTypeTitle',
                              label: 'Okno wyboru na popupie',
                              type: 'title',
                              displayCondition: individualSelectionWindowPopup,
                            },
                            {
                              id: 'activationModePopup',
                              label: 'Typ aktywacji:',
                              type: 'radio',
                              validation: ['required'],
                              props: {
                                disabled: !hasAccessToSelectionWindowsWrite,
                              },
                              onChange: (key, value) => onChangeWindow('activationMode', value, WINDOW_TYPE_POPUP),
                              displayCondition: individualSelectionWindowPopup,
                              options: activationModeOptions,
                            },
                            {
                              id: 'rangeDatePopup',
                              type: 'dateRange',
                              onChange: (key, value) => onChangeWindow('rangeDate', value, WINDOW_TYPE_POPUP),
                              validation: ['rangeRequiredBoth'],
                              displayCondition: individualSelectionWindowPopup,
                              props: {
                                disabled: !hasAccessToSelectionWindowsWrite,
                              },
                              depends: {
                                field: 'activationModePopup',
                                value: ACTIVATION_MODE_RANGE,
                              },
                            },
                            {
                              component: <PeriodicModeForm
                                key="periodicModePopup"
                                months={formData.periodicallyMonthsPopup}
                                days={formData.periodicallyDaysPopup}
                                disabled={!hasAccessToSelectionWindowsWrite}
                                onChange={(key, value) => onChangeWindow(key, value, WINDOW_TYPE_POPUP)}
                                errorMessage={errors?.periodicallyMonthsPopup}
                                validateField={(field, error) => validateField(`${field}Popup`, error)}
                              />,
                              displayCondition: individualSelectionWindowPopup,
                              props: {
                                disabled: !hasAccessToSelectionWindowsWrite,
                              },
                              depends: {
                                field: 'activationModePopup',
                                value: ACTIVATION_MODE_PERIODICALLY,
                              },
                            },
                            {
                              layout: LAYOUT_TWO_COLUMNS,
                              formElements: [
                                {
                                  id: 'sendingEmailsPopup',
                                  type: 'boolean',
                                  isCheckbox: true,
                                  displayCondition: individualSelectionWindowPopup,
                                  props: {
                                    disabled: !hasAccessToSelectionWindowsWrite,
                                  },
                                  onChange: (key, value) => onChangeWindow('sendingEmails', value, WINDOW_TYPE_POPUP),
                                  label: 'Wyślij e-mail X dni przed zakończeniem typu okna',
                                },
                                {
                                  id: 'daysSendEmailBeforeEndPopup',
                                  type: 'text',
                                  valueFormatter: 'integer',
                                  suffix: 'dni',
                                  validation: ['required'],
                                  props: {
                                    disabled: !hasAccessToSelectionWindowsWrite,
                                  },
                                  displayCondition: individualSelectionWindowPopup,
                                  onChange: (key, value) => onChangeWindow('daysSendEmailBeforeEnd', value, WINDOW_TYPE_POPUP),
                                  depends: {
                                    field: 'sendingEmailsPopup',
                                    value: true,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                        {
                          layout: LAYOUT_ONE_COLUMN,
                          border: individualSelectionWindowAccount,
                          formElements: [
                            {
                              id: 'individualWindowTypeTitle',
                              label: 'Okno wyboru w profilu',
                              type: 'title',
                              displayCondition: individualSelectionWindowAccount,
                            },
                            {
                              id: 'activationModeAccount',
                              label: 'Typ aktywacji:',
                              type: 'radio',
                              validation: ['required'],
                              props: {
                                disabled: !hasAccessToSelectionWindowsWrite,
                              },
                              onChange: (key, value) => onChangeWindow('activationMode', value, WINDOW_TYPE_ACCOUNT),
                              displayCondition: individualSelectionWindowAccount,
                              options: activationModeOptions,
                            },
                            {
                              id: 'rangeDateAccount',
                              type: 'dateRange',
                              validation: ['rangeRequiredBoth'],
                              displayCondition: individualSelectionWindowAccount,
                              onChange: (key, value) => onChangeWindow('rangeDate', value, WINDOW_TYPE_ACCOUNT),
                              props: {
                                disabled: !hasAccessToSelectionWindowsWrite,
                              },
                              depends: {
                                field: 'activationModeAccount',
                                value: ACTIVATION_MODE_RANGE,
                              },
                            },
                            {
                              component: <PeriodicModeForm
                                key="periodicModeAccount"
                                disabled={!hasAccessToSelectionWindowsWrite}
                                months={formData.periodicallyMonthsAccount}
                                days={formData.periodicallyDaysAccount}
                                onChange={(key, value) => onChangeWindow(key, value, WINDOW_TYPE_ACCOUNT)}
                                errorMessage={errors?.periodicallyMonthsAccount}
                                validateField={(field, error) => validateField(`${field}Account`, error)}
                              />,
                              displayCondition: individualSelectionWindowAccount,
                              depends: {
                                field: 'activationModeAccount',
                                value: ACTIVATION_MODE_PERIODICALLY,
                              },
                            },
                            {
                              layout: LAYOUT_TWO_COLUMNS,
                              formElements: [
                                {
                                  props: {
                                    disabled: !hasAccessToSelectionWindowsWrite,
                                  },
                                  id: 'sendingEmailsAccount',
                                  type: 'boolean',
                                  isCheckbox: true,
                                  onChange: (key, value) => onChangeWindow('sendingEmails', value, WINDOW_TYPE_ACCOUNT),
                                  displayCondition: individualSelectionWindowAccount,
                                  label: 'Wyślij e-mail X dni przed zakończeniem typu okna',
                                },
                                {
                                  id: 'daysSendEmailBeforeEndAccount',
                                  displayCondition: individualSelectionWindowAccount,
                                  type: 'text',
                                  valueFormatter: 'integer',
                                  suffix: 'dni',
                                  onChange: (key, value) => onChangeWindow('daysSendEmailBeforeEnd', value, WINDOW_TYPE_ACCOUNT),
                                  validation: ['required'],
                                  props: {
                                    disabled: !hasAccessToSelectionWindowsWrite,
                                  },
                                  depends: {
                                    field: 'sendingEmailsAccount',
                                    value: true,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'organizationUnit',
                      label: 'Jednostka organizacyjna:',
                      type: 'select',
                      options: organizationUnits,
                      validation: enableOrganizationUnits ? ['required'] : null,
                    },
                  ],
                },
                {
                  title: 'Abonamenty',
                  formElements: [
                    {
                      id: 'individualSubscriptionWindow',
                      label: 'Indywidualne okno wyboru abonamentów:',
                      type: 'dateRange',
                      onChange: onRangeChange,
                    },
                  ],
                },
                {
                  title: 'Zarządzanie kontem użytkownika',
                  formElements: [
                    {
                      type: 'title',
                      id: 'active',
                      label: data?.active ? 'Konto jest aktywne' : 'Konto jest nieaktywne',
                    },
                    {
                      id: 'activeFrom',
                      label: 'Konto aktywne od:',
                      type: 'date',
                    },
                    {
                      id: 'activeTo',
                      label: 'Dezaktywacja konta z dniem:',
                      type: 'date',
                      validation: [{
                        method: 'greaterEqualThanDate',
                        args: [data ? data.activeFrom : 0],
                      }],
                      tooltip: {
                        type: 'info',
                        content: (
                          <>
                            Z datą dezaktywacji konto pracownika zostanie zamknięte.
                            {' '}
                            <br />
                            {' '}
                            Konto ze
                            zmienionym statusem będzie nadal widoczne na liście pracowników
                            oraz w
                            historii operacji.
                            <br />
                            <br />
                            Uwaga! Jeżeli podczas ustawienia daty dezaktywacji pracownika
                            zostały zrezygnowane świadczenia abonamentowe,
                            <br />
                            to zmiana lub usunięcie tej daty nie modyfikuje dat rezygnacji
                            tych
                            świadczeń.
                          </>
                        ),
                      },
                    },
                    {
                      id: 'password',
                      label: 'Hasło:',
                      type: 'password',
                      onChange: (key, value) => {
                        setGeneratedPassword('');
                        onChange(key, value);
                      },
                      displayCondition: !isNew,
                      validation: ['password'],
                    },
                    {
                      id: 'password2',
                      label: 'Powtórz hasło:',
                      type: 'password',
                      displayCondition: !isNew,
                      validation: [{
                        method: 'mustBeEqual',
                        args: [data && data.password, 'Hasła nie są takie same'],
                      }],
                      props: {
                        previewToggle: false,
                      },
                    },
                    {
                      id: 'generatePassword',
                      label: 'Generuj hasło',
                      type: 'button',
                      component: (
                        <div key="generate_passowrd">
                          <Button
                            color="secondary"
                            onClick={() => {
                              const password = generatePassword();
                              const updatedData = { ...data };
                              updatedData.password = password;
                              updatedData.password2 = password;
                              const updatePassword = () => {
                                updateData(updatedData);
                                setGeneratedPassword(password);
                              };
                              getUserConfirmationPopup(
                                <>
                                  <div>{`Nowe hasło: ${password}`}</div>
                                  <br />
                                  <div>Stare hasło zostanie nadpisane. Czy na pewno chcesz dokonać tej zmiany?</div>
                                </>, (confirm) => confirm && updatePassword(), 'Generowanie hasła',
                              );
                            }}
                          >
                            {__('Generuj hasło')}
                          </Button>
                          <DefaultTooltip
                            content={(
                              <>
                                Wygeneruj nowe hasło, jeśli pracownik zapomniał
                                {' '}
                                <br />
                                {' '}
                                poprzedniego i nie
                                jest w stanie samodzielnie nadać nowego.
                              </>
                            )}
                            id="generate_password_tooltip"
                          />
                          {generatedPassword ? `${__('Wygenerowane hasło')}: ${generatedPassword}` : null}
                        </div>
                      ),
                      displayCondition: !isNew,
                    },
                    {
                      label: 'Hasło do systemu zostanie wygenerowane po kliknięciu na przycisk "Zapisz".',
                      type: 'title',
                      displayCondition: isNew,
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}

const sendMessageToUser = async (employeeId, type, setBlockedButtons) => {
  try {
    setBlockedButtons(true);
    await restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      `/employee/${employeeId}/password/${type}`,
      'GET',
      {},
      {},
    );
    const message = type === 'sms' ? 'Wysłano SMS do pracownika.' : 'Wysłano e-mail do pracownika.';
    dynamicNotification(__(message));
  } catch (e) {
    console.error(e);
    const message = type === 'sms' ? 'Nie udało się wysłać wiadomości SMS.' : 'Nie udało się wysłać wiadomości e-mail.';
    dynamicNotification(e.message || message, 'error');
  }
  setBlockedButtons(false);
};

General.propTypes = {
  active: PropTypes.bool,
  companyId: PropTypes.string.isRequired,
  setEmployeeData: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
  setIsEdited: PropTypes.func,
  isNew: PropTypes.bool,
};

General.defaultProps = {
  isNew: false,
  active: false,
  setIsEdited: () => {
  },
};
