import React, { useState, useCallback, useEffect } from 'react';
import { Button, Alert } from 'reactstrap';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import Form from '../../../../../Components/Form';
import useRentableGroups from '../../../../../utils/hooks/company/useRentableGroups';
import useOrganizationUnits from '../../../../../utils/hooks/company/useOrganizationUnits';
import { LAYOUT_ONE_COLUMN, LAYOUT_TWO_COLUMNS } from '../../../../../Components/Layouts';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import useSuppliers from '../../../../../utils/hooks/suppliers/useSuppliers';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import useBenefitCategories from '../../../../../utils/hooks/benefit/useBenefitCategories';
import useBenefits, { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefits';
import {
  COLLECTED_DATA_SCOPE_EMAIL,
  COLLECTED_DATA_SCOPE_ID,
  COLLECTED_DATA_SCOPE_ID_AND_EMAIL,
  COLLECTED_DATA_SCOPE_NAMES,
  COLLECTED_DATA_SCOPE_NONE,
  EMPLOYEE_GROUP_METHOD_CO_FINANCED,
  EMPLOYEE_GROUP_METHOD_EMPLOYEE,
  EMPLOYEE_GROUP_METHOD_EMPLOYER, EMPLOYEER_PRICE_TYPE_CHOICE, EMPLOYEER_PRICE_TYPE_HIDDEN,
  methodRequireEmployeePayment,
  parseBenefitDataFromBackend,
  parseBenefitDataToBackend,
  parseBenefitEmployeeGroupDataFromBackend,
  RELATION_BENEFIT_TYPE_AUTO, RELATION_BENEFIT_TYPE_FREE,
  RELATION_BENEFIT_TYPE_MANDATORY,
  RELATION_BENEFIT_TYPE_OPTIONAL,
  saveEmployeeGroupBenefits,
} from './utils';
import useBenefitGroups, { IRI_PREFIX as BENEFIT_GROUP_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefitGroups';
import { getIdFromIri, getIriFromId } from '../../../../../utils/jsHelpers/iriConverter';
import useConfigValue from '../../../../../utils/hooks/configuration/useConfigValue';
import arrayUnique from '../../../../../utils/jsHelpers/arrayUnique';
import mockBenefitsEmployeeGroupData from '../utils/mockBenefitsEmployeeGroupData';
import { subscriptionBenefitPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import FormsAssigment from './FormsAssigment';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import { employerPriceTypeOptions } from '../utils/consts';
import { GROUP_TYPE_MULTI_CHOICE } from '../EditBenefitGroup/popup';

export default function EditBenefit({
  match,
}) {
  const {
    companyId, benefitId, benefitGroupId,
  } = match.params;
  const history = useHistory();
  const isNew = benefitId === undefined;
  const [data, setData] = useState({
    manualActivationIsDefault: true,
    defaultDescription: true,
  });

  const [benefitsOptions, setBenefitsOptions] = useState([]);
  const [benefitsCanBeReplacedOptions, setBenefitsCanBeReplacedOptions] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [employeeGroupsConfig, setEmployeeGroupsConfig] = useState([{}]);
  const [employeeGroupsConfigToDelete, setEmployeeGroupsConfigToDelete] = useState([]);

  const benefitCategories = useBenefitCategories(true, null, null, true);
  const benefitGroupIdValue = benefitGroupId || getIdFromIri(data?.benefitGroup, BENEFIT_GROUP_IRI_PREFIX);
  const benefits = useBenefits(false, 'companyId', companyId, 'benefitGroup', benefitGroupIdValue, false, benefitGroupIdValue === null);

  const {
    manualActivation: manualActivationGroupValue,
    manualActivationIsDefault: manualActivationUseCompanyValue,
    benefitDescription: descriptionFromGroup,
    type: benefitGroupType,
    maxChoices: benefitGroupMaxChoices,
    minChoices: benefitGroupMinChoice,
  } = useBenefitGroups(
    false,
    'id',
    benefitGroupIdValue,
    false,
    !benefitGroupIdValue,
  )[0] || {};
  const manualActivationCompanyValue = useConfigValue('subscription/generalConfig/manualActivation', companyId) || false;

  const isRelationResignationAvailable = data.relationResignationAvailable === 'true';
  const isGroupTypeMultiChoice = benefitGroupType === GROUP_TYPE_MULTI_CHOICE && (benefitGroupMinChoice !== 1 || benefitGroupMaxChoices !== 1);
  const relationsDisabled = isRelationResignationAvailable || isGroupTypeMultiChoice;

  useEffect(() => {
    const benefitsRawOptions = benefits.map(({ name, id }) => ({ value: getIriFromId(id, BENEFIT_IRI_PREFIX), label: name }));
    const benefitsCanBeReplaced = benefits.filter(({ relationBenefitAutomaticTypeConfiguration }) => (
      relationBenefitAutomaticTypeConfiguration !== undefined && relationBenefitAutomaticTypeConfiguration.includes('can_be_replaced')));
    const benefitsCanBeReplacedRawOptions = benefitsCanBeReplaced.map(({ name, id }) => ({ value: id, label: name }));
    if (benefitId) {
      setBenefitsOptions(benefitsRawOptions.filter(({ value }) => value !== benefitId));
      setBenefitsCanBeReplacedOptions(benefitsCanBeReplacedRawOptions.filter(({ value }) => value !== benefitId));
    } else {
      setBenefitsOptions(benefitsRawOptions);
      setBenefitsCanBeReplacedOptions(benefitsCanBeReplacedRawOptions);
    }
  }, [benefits, benefitId]);
  useEffect(() => {
    if (benefitId) {
      restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/benefit-employee-groups',
        'GET',
        {
          params: {
            benefit: getIriFromId(benefitId, BENEFIT_IRI_PREFIX),
            itemsPerPage: 10000,
          },
        },
        [...mockBenefitsEmployeeGroupData],
      ).then((res) => (setEmployeeGroupsConfig(res.length ? res.map((el) => parseBenefitEmployeeGroupDataFromBackend(el)) : [{}])))
        .catch((e) => {
          console.error(e);
          dynamicNotification(e.message || __('Nie udało się pobrać konfiguracji abonamentu dla grup pracowniczych'), 'error');
        });
    }
  }, [benefitId]);

  const submit = async () => {
    try {
      const body = parseBenefitDataToBackend({ ...data, organizationUnitIds: [], rentableGroupIds: [] });
      if (isNew) {
        body.benefitGroup = getIriFromId(benefitGroupId, BENEFIT_GROUP_IRI_PREFIX);
      }

      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/benefits' : `/benefits/${benefitId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body,
        },
      );
      dynamicNotification(__('Pomyślnie zapisano abonament'));
      const newData = parseBenefitDataFromBackend(res);

      const newBenefitEmployeeGroups = await saveEmployeeGroupBenefits(employeeGroupsConfig, employeeGroupsConfigToDelete, newData.id);
      if (isNew) {
        history.push(`/company/edit/${companyId}/subscriptions/benefits/edit/${res.id}`);
      } else {
        setEmployeeGroupsConfig(
          newBenefitEmployeeGroups.length ? newBenefitEmployeeGroups.map((el) => parseBenefitEmployeeGroupDataFromBackend(el)) : [{}],
        );
        setData({ ...newData });
        setOriginalData({ ...newData });
        setEmployeeGroupsConfigToDelete([]);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać abonamentu'), 'error');
    }
  };
  const companyName = useCompanyName();

  const rentableGroups = useRentableGroups(true, 'companyId', companyId, false, !companyId);
  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, false, !companyId);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  const onChangeRelationBenefitTypeConfiguration = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updatedData.relationBenefitOptionalTypeConfiguration = null;
    setData(updatedData);
  };

  useEffect(() => {
    setIsFetched(false);
  }, [benefitId]);

  const updateEmployeeGroupConfig = (key, value, field) => {
    const index = +key.replace(field, '');
    const newConfiguration = [...employeeGroupsConfig];
    newConfiguration[index][field] = value;
    if (field === 'employerPriceType' && value === EMPLOYEER_PRICE_TYPE_CHOICE) {
      if (newConfiguration[index].method === EMPLOYEE_GROUP_METHOD_CO_FINANCED) {
        newConfiguration[index].method = null;
      }
    }
    setEmployeeGroupsConfig(newConfiguration);
  };
  const configurationGroupsData = {};
  const usedEmployeeGroups = [];
  let isPaidByEmployee = false;
  employeeGroupsConfig.forEach((el, index) => {
    if (!isPaidByEmployee && methodRequireEmployeePayment(el.method)) {
      isPaidByEmployee = true;
    }
    Object.keys(el).forEach((key) => {
      const value = el[key];
      if (key === 'employeeGroupId') {
        usedEmployeeGroups.push(value);
      }
      configurationGroupsData[`${key}${index}`] = value;
    });
    if (el.employerPriceType === EMPLOYEER_PRICE_TYPE_CHOICE) {
      configurationGroupsData[`employeePrice${index}`] = null;
      configurationGroupsData[`employerPrice${index}`] = null;
    }
  });
  const employeeGroupConfigFields = employeeGroupsConfig.map((benefit, index) => {
    const removeButton = employeeGroupsConfig.length > 1 ? (
      <i
        className="lnr-trash btn-icon-wrapper cursor-pointer"
        role="presentation"
        onClick={() => removeEmployeeGroupConfigField(index)}
      />
    ) : null;
    const priceIsEmployeeChoice = benefit.employerPriceType === EMPLOYEER_PRICE_TYPE_CHOICE;
    return {
      layout: LAYOUT_TWO_COLUMNS,
      border: true,
      formElements: [
        {
          layout: LAYOUT_ONE_COLUMN,
          formElements: [{
            id: `employeeGroupId${index}`,
            label: (
              <>
                {removeButton}
                {' '}
                {`Grupa pracownicza ${index + 1}:`}
              </>
            ),
            type: 'autocomplete',
            options: employeeGroups.map((el) => ({
              ...el,
              isDisabled: usedEmployeeGroups.includes(el.value),
            })),
            onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employeeGroupId'),
            validation: ['required'],
            props: {
              disabled: Boolean(configurationGroupsData[`id${index}`]),
            },
          },
          {
            id: `employerPriceType${index}`,
            label: 'Koszt świadczenia:',
            type: 'radio',
            onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employerPriceType'),
            options: employerPriceTypeOptions,
            validation: ['required'],
          },
          {
            id: `priceVariants${index}`,
            type: 'text',
            label: 'Kwoty do wyboru (rozdzielone średnikiem):',
            onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'priceVariants'),
            depends: {
              functionValidation: (dataValidation) => dataValidation[`employerPriceType${index}`] === EMPLOYEER_PRICE_TYPE_CHOICE,
            },
            validation: ['required', 'numberList'],
          },
          {
            id: `commissionPercentage${index}`,
            type: 'text',
            label: 'Procent prowizji:',
            onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'commissionPercentage'),
            depends: {
              functionValidation: (dataValidation) => dataValidation[`employerPriceType${index}`] === EMPLOYEER_PRICE_TYPE_CHOICE,
            },
            valueFormatter: 'integer',
          },
          {
            id: `employerPriceAlternativeText${index}`,
            type: 'text',
            label: 'Komunikat:',
            onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employerPriceAlternativeText'),
            depends: {
              functionValidation: (dataValidation) => dataValidation[`employerPriceType${index}`] === EMPLOYEER_PRICE_TYPE_HIDDEN,
            },
          }],
        },
        {
          layout: LAYOUT_ONE_COLUMN,
          formElements: [
            {
              id: `method${index}`,
              type: 'radio',
              onChange: (key, value) => {
                if (methodRequireEmployeePayment(value) && data.relationBenefitTypeConfiguration === RELATION_BENEFIT_TYPE_AUTO) {
                  getUserConfirmationPopup(
                    __('Ta zmiana spowoduje że dowolność świadczenia przestanie być automatyczna.'),
                    (confirm) => {
                      if (confirm) {
                        updateEmployeeGroupConfig(key, value, 'method');
                        onChange('relationBenefitTypeConfiguration', null);
                      }
                    },
                    __('Czy jesteś pewny?'),
                  );
                } else {
                  updateEmployeeGroupConfig(key, value, 'method');
                }
              },
              label: 'Sposób opłacania dla wskazanej grupy pracowniczej:',
              options: [
                {
                  value: EMPLOYEE_GROUP_METHOD_EMPLOYER,
                  label: 'pracodawca',
                },
                {
                  value: EMPLOYEE_GROUP_METHOD_EMPLOYEE,
                  label: 'pracownik',
                },
                {
                  value: EMPLOYEE_GROUP_METHOD_CO_FINANCED,
                  label: 'współfinansowany z pracodawcą',
                  disabled: priceIsEmployeeChoice,
                  tooltip: priceIsEmployeeChoice
                    ? { content: __('Opcja niedostępna dla wskazanego rodzaju kosztu świadczenia') } : null,
                },
              ],
              validation: ['required'],
            },
            {
              layout: LAYOUT_TWO_COLUMNS,
              formElements: [
                {
                  id: `employeePrice${index}`,
                  type: 'text',
                  label: 'Pracownik:',
                  onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employeePrice'),
                  suffix: 'PLN',
                  valueFormatter: 'float',
                  props: {
                    disabled: priceIsEmployeeChoice,
                  },
                  displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE]
                    .includes(configurationGroupsData[`method${index}`]),

                },
                {
                  id: `employeePayrollNumber${index}`,
                  onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employeePayrollNumber'),
                  type: 'text',
                  displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE]
                    .includes(configurationGroupsData[`method${index}`]),
                  label: 'Składnik płacowy:',
                  validation: ['required', { method: 'minLength', args: [3] }],
                },
              ],
            },
            {
              layout: LAYOUT_TWO_COLUMNS,
              formElements: [
                {
                  id: `employerPrice${index}`,
                  type: 'text',
                  onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employerPrice'),
                  label: configurationGroupsData[`method${index}`] === EMPLOYEE_GROUP_METHOD_EMPLOYER ? 'Pracodawca:' : 'Pracodawca/ZFŚS:',
                  suffix: 'PLN',
                  valueFormatter: 'float',
                  props: {
                    disabled: priceIsEmployeeChoice,
                  },
                  displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYER]
                    .includes(configurationGroupsData[`method${index}`]),
                },
                {
                  id: `employerPayrollNumber${index}`,
                  type: 'text',
                  onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'employerPayrollNumber'),
                  validation: ['required', { method: 'minLength', args: [3] }],
                  displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYER]
                    .includes(configurationGroupsData[`method${index}`]),
                  label: 'Składnik płacowy:',
                },
              ],
            },
            {
              id: `active${index}`,
              type: 'boolean',
              onChange: (key, value) => updateEmployeeGroupConfig(key, value, 'active'),
              label: 'Świadczenie aktywne we wskazanej grupie pracowniczej',
            },
          ],
        },
      ],
    };
  });

  const addEmployeeGroupConfigField = () => {
    const updatedConfigs = Array.isArray(employeeGroupsConfig) ? [...employeeGroupsConfig] : [];
    updatedConfigs.push({});
    setEmployeeGroupsConfig(updatedConfigs);
  };
  const removeEmployeeGroupConfigField = (index) => {
    const updatedConfigs = Array.isArray(employeeGroupsConfig) ? [...employeeGroupsConfig] : [];
    const removedItem = updatedConfigs[index] || {};
    if (removedItem?.id) {
      setEmployeeGroupsConfigToDelete([...employeeGroupsConfigToDelete, removedItem.id].filter(arrayUnique));
    }
    setEmployeeGroupsConfig(updatedConfigs.filter((el, elIndex) => elIndex !== index));
  };
  const suppliers = useSuppliers(true, false, true);

  const formData = {
    ...data,
    ...configurationGroupsData,
    relationPeriodResignationBlockade: !isRelationResignationAvailable ? data.relationPeriodResignationBlockade : null,
    relationExtensionPeriod: relationsDisabled ? null : data.relationExtensionPeriod,
    relationExtendedBenefits: relationsDisabled ? null : data.relationExtendedBenefits,
    relationRestrictionPeriod: relationsDisabled ? null : data.relationRestrictionPeriod,
    relationRestrictedBenefits: relationsDisabled ? null : data.relationRestrictedBenefits,
  };
  if (data.manualActivationIsDefault) {
    formData.manualActivationRequired = manualActivationUseCompanyValue ? manualActivationCompanyValue : manualActivationGroupValue;
  }
  if (data.defaultDescription) {
    formData.description = descriptionFromGroup || '';
  }

  return (
    <DataLoading
      service={SUBSCRIPTION_MANAGEMENT_SERVICE}
      endpoint={`/benefits/${benefitId}`}
      fetchedData={isNew || isFetched}
      mockDataEndpoint="/benefit/edit"
      updateData={(res) => {
        const newData = parseBenefitDataFromBackend(res);
        setData({ ...newData });
        setOriginalData({ ...newData });
        setIsFetched(true);
      }}
    >
      <PageTitle
        heading={`${isNew ? 'Dodawanie' : 'Edycja'} abonamentu ${!isNew ? ` ${originalData.name} ` : ''} dla firmy ${companyName} (ID: ${companyId})`}
        breadcrumbsHeading={`${isNew ? 'Dodawanie' : 'Edycja'} abonamentu`}
        pushToHistory
        historyElementType="edit"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          {
            title: 'Świadczenia cykliczne',
            link: `/company/edit/${companyId}/subscriptions/`,
          },
          {
            title: 'Świadczenia abonamentowe',
            link: `/company/edit/${companyId}/subscriptions/benefits/default`,
          },
        ]}
      />
      <Form
        id="editSubscriptionForm"
        data={formData}
        config={{
          additionalValidation: (invalidFields, setInvalidFields) => {
            const newInvalidFields = { ...invalidFields };
            let isValid = true;
            if (isPaidByEmployee && data.relationBenefitTypeConfiguration === RELATION_BENEFIT_TYPE_AUTO) {
              newInvalidFields.relationBenefitTypeConfiguration = __('Wybrano niedostępną opcję');
              isValid = false;
            }
            employeeGroupsConfig.forEach(({ employerPriceType, method }, key) => {
              if (employerPriceType === EMPLOYEER_PRICE_TYPE_CHOICE && method === EMPLOYEE_GROUP_METHOD_CO_FINANCED) {
                newInvalidFields[`method${key}`] = __('Wybrano niedostępną opcję');
                isValid = false;
              }
            });
            if (!isValid) {
              setInvalidFields(newInvalidFields);
            }

            return isValid;
          },
          defaultOnChange: onChange,
          title: isNew ? 'Dodaj abonament' : 'Edytuj abonament',
          onSubmit: submit,
          buttons: [
            {
              text: 'Zapisz',
              type: 'submit',
              id: 'editSubscriptionSubmit',
              permission: subscriptionBenefitPermissionWrite,
            },
          ],
          formGroups: [
            {
              title: 'Podstawowe informacje',
              formElements: [
                {
                  layout: LAYOUT_TWO_COLUMNS,
                  formElements: [
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          id: 'name',
                          type: 'text',
                          label: 'Nazwa benefitu:',
                          validation: ['required'],
                          translatable: {
                            scope: 'company-management_subscription_subscriptionName',
                          },
                        },
                        {
                          id: 'supplierId',
                          type: 'autocomplete',
                          label: 'Dostawca:',
                          validation: ['required'],
                          options: suppliers,
                        },
                        {
                          id: 'benefitCategory',
                          label: 'Kategoria abonamentowa',
                          type: 'autocomplete',
                          options: benefitCategories,
                          validation: ['required'],
                        },
                        {
                          id: 'code',
                          type: 'text',
                          label: 'Kod produktu:',
                        },
                        {
                          id: 'thresholdDay',
                          type: 'text',
                          valueFormatter: 'integer',
                          label: 'Indywidualny dzień przełomu zakupu:',
                          tooltip: {
                            content: 'Dzień przełomu musi być wcześniejszy lub równy dacie akceptacji w poczekalni.',
                          },
                        },
                        {
                          id: 'manualActivationRequired',
                          type: 'boolean',
                          label: 'Wymagaj ręcznej aktywacji',
                          inputSwitcher: {
                            onChange: (field, checked) => {
                              onChange('manualActivationIsDefault', checked);
                            },
                            disableIfChecked: true,
                            switcherValue: data.manualActivationIsDefault,
                            label: 'Użyj wartości z ustawień grupy',
                          },
                        },
                        {
                          id: 'pendingDay',
                          type: 'text',
                          valueFormatter: 'integer',
                          label: 'Termin, kiedy może się odbyć akceptacja w poczekalni (1-31):',
                          validation: data.manualActivationRequired === true ? [
                            'required',
                            { method: 'greaterEqualThan', args: [1] },
                            { method: 'lessEqualThan', args: [31] },
                          ] : [
                            { method: 'greaterEqualThan', args: [1] },
                            { method: 'lessEqualThan', args: [31] },
                          ],
                        },
                      ],
                    },
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          id: 'description',
                          type: 'wysiwyg',
                          label: 'Opis świadczenia abonamentowego:',
                          className: 'mb-2',
                          translatable: {
                            isCms: true,
                            code: 'company-management_subscriptionDesc',
                          },
                          inputSwitcher: {
                            onChange: (field, checked) => {
                              onChange('defaultDescription', checked);
                            },
                            disableIfChecked: true,
                            switcherValue: data.defaultDescription,
                            label: 'Użyj wartości z ustawień grupy',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: 'Cena i dostępność',
              formElements: [
                ...employeeGroupConfigFields,
                {
                  displayCondition: employeeGroupsConfig.length < employeeGroups.length,
                  component: (
                    <Button key="add_Fields" color="link" onClick={addEmployeeGroupConfigField}>
                      <i className="pe-7s-plus pe-3x pe-va" />
                      {' '}
                      Wybierz kolejną grupę pracowniczą
                    </Button>
                  ),
                },
                {
                  layout: LAYOUT_TWO_COLUMNS,
                  formElements: [
                    {
                      id: 'rentableGroupIds',
                      type: 'multiselect',
                      label: 'Grupy dochodowości: (nieobsłużone na MVP)',
                      options: rentableGroups,
                      props: {
                        disabled: true,
                      },
                    },
                    {
                      id: 'organizationUnitIds',
                      type: 'multiselect',
                      label: 'Jednostki organizacyjne: (nieobsłużone na MVP)',
                      options: organizationUnits,
                      props: {
                        disabled: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              title: 'Zakres danych',
              formElements: [
                {
                  layout: LAYOUT_TWO_COLUMNS,
                  formElements: [
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          id: 'collectedDataScope',
                          type: 'select',
                          label: 'Zakres gromadzonych danych:',
                          validation: ['required'],
                          options: [
                            {
                              value: COLLECTED_DATA_SCOPE_NONE,
                              label: 'bez imion i nazwisk',
                            },
                            {
                              value: COLLECTED_DATA_SCOPE_NAMES,
                              label: 'przechowywanie imion i nazwisk',
                            },
                            {
                              value: COLLECTED_DATA_SCOPE_ID,
                              label: 'przechowywanie numerów PESEL, imion i nazwisk',
                            },
                            {
                              value: COLLECTED_DATA_SCOPE_EMAIL,
                              label: 'przechowywanie imion i nazwisk oraz adresu e-mail',
                            },
                            {
                              value: COLLECTED_DATA_SCOPE_ID_AND_EMAIL,
                              label: 'przechowywanie imion i nazwisk, adresu e-mail oraz numerów PESEL',
                            },
                          ],
                        },
                        {
                          id: 'benefitReceiver',
                          type: 'checkbox',
                          label: 'Świadczenie dla:',
                          options: [
                            {
                              value: 'employee',
                              label: 'pracownika',
                            },
                            {
                              value: 'others',
                              label: 'Innych osób',
                            },
                          ],
                          validation: ['requiredCheckbox'],
                        },
                        {
                          id: 'maxPeople',
                          type: 'text',
                          valueFormatter: 'integer',
                          label: 'Świadczenie dla maks. liczby osób:',
                          validation: ['required', { method: 'greaterEqualThan', args: [1] }],
                        },
                        {
                          id: 'purchaseMethod',
                          type: 'select',
                          label: 'Sposób zakupu świadczenia:',
                          options: [
                            {
                              value: 'individual',
                              label: 'indywidualnie',
                            },
                            {
                              value: 'group',
                              label: 'pakietowo',
                            },
                          ],
                          validation: ['required'],
                          tooltip: {
                            content:
  <p>
    Sposób zakupu świadczenia dla osób dodatkowych:
    <br />
    -indywidualnie - dla każdej dodatkowej osoby zostanie
    utworzone w systemie oddzielne świadczenie.
    {' '}
    <br />
    - pakietowo - zakup w ramach pojedynczego świadczenia,
    wszystkie osoby
    {' '}
    <br />
    (pracownik wraz z osobami dodatkowymi) zostaną
    przypisane do jednego świadczenia.
  </p>,

                          },
                        },
                      ],
                    },
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          component: <FormsAssigment key="formAssignment" onChange={onChange} data={data} companyId={companyId} />,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: 'Powiązania',
              formElements: [
                {
                  layout: LAYOUT_TWO_COLUMNS,
                  formElements: [
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          component: (
                            <Alert color="secondary">
                              {isGroupTypeMultiChoice
                                ? __('Dla grupy abonamentowej o wielokrotnym wyborze zawężenia i poszerzenia nie są brane pod uwagę.')
                                : __('Przy możliwej rezygnacji przed zawężeniem/rozszerzeniem zawężenia i poszerzenia nie są brane pod uwagę.')}
                            </Alert>
                          ),
                          displayCondition: relationsDisabled,
                        },
                        {
                          id: 'relationExtensionPeriod',
                          type: 'text',
                          valueFormatter: 'integer',
                          validation: [{ method: 'greaterEqualThan', args: [0] }],
                          props: {
                            disabled: relationsDisabled,
                          },
                          label: 'Okres do poszerzenia (w miesiącach):',
                        },
                        {
                          id: 'relationExtendedBenefits',
                          type: 'multiselect',
                          label: 'Benefity poszerzone:',
                          options: benefitsOptions,
                          props: {
                            disabled: relationsDisabled,
                          },
                        },
                        {
                          id: 'relationRestrictionPeriod',
                          label: 'Okres do zawężenia (w miesiącach):',
                          type: 'text',
                          valueFormatter: 'integer',
                          validation: relationsDisabled ? [] : ['required', { method: 'greaterEqualThan', args: [0] }],
                          props: {
                            disabled: relationsDisabled,
                          },
                        },
                        {
                          id: 'relationRestrictedBenefits',
                          type: 'multiselect',
                          label: 'Benefity zawężone:',
                          options: benefitsOptions,
                          props: {
                            disabled: relationsDisabled,
                          },
                        },
                        {
                          type: 'autocomplete',
                          id: 'relationParentalLeave',
                          label: 'Urlop wychowawczy - downgrade: (nieobsłużone na MVP)',
                          props: {
                            disabled: true,
                          },
                          options: benefitsOptions,
                        },
                      ],
                    },
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          id: 'relationResignationAvailable',
                          type: 'radio',
                          label: 'Rezygnacja przed zawężeniem/rozszerzeniem:',
                          options: [
                            {
                              value: 'false',
                              label: 'zablokowane',
                              tooltip: {
                                type: 'info',
                                content:
  <p>
    Rezygnacja ze świadczenia nie jest możliwa
    <br />
    {' '}
    dopóki nie minie okres stanowiący wartość
    <br />
    maksymalną z okresu do poszerzenia i
    {' '}
    <br />
    {' '}
    okresu do zawężenia. Możliwe jest natomiast
    <br />
    {' '}
    wybranie innego świadczenia w danej grupie
    <br />
    produktów o ile pozwalan na to konfiguracja.
    {' '}
    <br />
    {' '}
    Dotyczy konfiguratora świadczeń abonamentowych.
  </p>,
                              },
                            },
                            {
                              value: 'true',
                              label: 'możliwa',
                              tooltip: {
                                type: 'info',
                                content:
  <p>
    Ze świadczenia można zrezygnować przy
    {' '}
    <br />
    każdym wejściu na konfigurator świadczeń
    {' '}
    <br />
    abonamentowych.

  </p>,
                              },
                            },
                          ],
                        },
                        {
                          id: 'relationPeriodResignationBlockade',
                          type: 'text',
                          valueFormatter: 'integer',
                          validation: isRelationResignationAvailable ? [] : ['required', { method: 'greaterEqualThan', args: [0] }],
                          label: 'Blokada na rezygancję ze świadczeń:',
                          props: {
                            disabled: isRelationResignationAvailable,
                          },
                          tooltip: {
                            type: 'info',
                            content:
  <p>
    Określa minimalną liczbę miesięcy, jaka musi
    {' '}
    <br />
    upłynąć, aby pracownik mógł zrezygnować ze
    <br />
    {' '}
    świadczenia.

  </p>,
                          },
                        },
                        {
                          layout: LAYOUT_TWO_COLUMNS,
                          formElements: [
                            {
                              id: 'relationBenefitTypeConfiguration',
                              type: 'radio',
                              label: 'Dowolność świadczenia:',
                              onChange: onChangeRelationBenefitTypeConfiguration,
                              validation: ['required'],
                              options: [
                                {
                                  value: RELATION_BENEFIT_TYPE_AUTO,
                                  label: 'automatyczny',
                                  disabled: isPaidByEmployee,
                                  tooltip: isPaidByEmployee
                                    ? { content: __('Świadczenie, które jest opłacane przez pracownika nie może być automatyczne') } : null,
                                },
                                {
                                  value: RELATION_BENEFIT_TYPE_MANDATORY,
                                  label: 'obowiązkowy',
                                },
                                {
                                  value: RELATION_BENEFIT_TYPE_OPTIONAL,
                                  label: 'opcjonalny',
                                },
                                {
                                  value: RELATION_BENEFIT_TYPE_FREE,
                                  label: 'dowolny',
                                },
                              ],
                            },
                            {
                              id: 'relationBenefitOptionalTypeConfiguration',
                              type: 'radio',
                              label: 'Zależność świadczenia:',
                              displayCondition: data.relationBenefitTypeConfiguration === 'free',
                              options: [
                                {
                                  value: 'independent',
                                  label: 'niezależny',
                                },
                                {
                                  value: 'dependent',
                                  label: 'zależny',
                                },
                                {
                                  value: 'replacing',
                                  label: 'zastępujący',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'relationBenefitOptionalTypeConfigurationDependingOn',
                          label: 'Zależny od:',
                          type: 'autocompleteMultiselect',
                          validation: ['required'],
                          displayCondition: data.relationBenefitOptionalTypeConfiguration === 'dependent',
                          options: benefitsOptions,
                        },
                        {
                          label: 'Zastępuje:',
                          type: 'autocomplete',
                          id: 'relationBenefitOptionalTypeConfigurationReplacing',
                          displayCondition: data.relationBenefitOptionalTypeConfiguration === 'replacing',
                          options: benefitsCanBeReplacedOptions,
                          validation: ['required'],
                        },
                        {
                          id: 'relationBenefitAutomaticTypeConfiguration',
                          displayCondition: data.relationBenefitTypeConfiguration === 'auto',
                          type: 'checkbox',
                          label: 'Ustawienia dla świadczenia automatycznego:',
                          options: [
                            {
                              value: '1',
                              label: 'może być zastąpiony innym świadczeniem',
                            },
                            {
                              value: '2',
                              label: 'ukryj przy wyborze świadczeń',
                            },
                            {
                              value: '3',
                              label: 'ukryj w widoku "moje abonamenty"',
                            },
                            {
                              value: '4',
                              label: 'nie generuj płatności dla tego świadczenia',
                            },
                          ],
                        },
                      ],
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

EditBenefit.propTypes = {
  match: matchPropTypes.isRequired,
};
