import React, { useState, useCallback, useEffect } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import Form from '../../../../../Components/Form';
import { LAYOUT_ONE_COLUMN, LAYOUT_TWO_COLUMNS } from '../../../../../Components/Layouts';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import {
  EMPLOYEE_GROUP_METHOD_CO_FINANCED,
  EMPLOYEE_GROUP_METHOD_EMPLOYEE,
  EMPLOYEE_GROUP_METHOD_EMPLOYER, EMPLOYEER_PRICE_TYPE_CHOICE, EMPLOYEER_PRICE_TYPE_HIDDEN,
  parseBenefitEmployeeGroupDataFromBackend, parseBenefitEmployeeGroupDataToBackend, RELATION_BENEFIT_TYPE_AUTO,
} from '../EditBenefit/utils';
import useBenefitGroups, { IRI_PREFIX as BENEFIT_GROUP_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefitGroups';
import { getIdFromIri } from '../../../../../utils/jsHelpers/iriConverter';
import { subscriptionBenefitEmployeeGroupPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import { employerPriceTypeOptions } from '../utils/consts';

export default function EditBenefit({
  match,
}) {
  const {
    companyId, benefitEmployeeGroupId,
  } = match.params;
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [isFetched, setIsFetched] = useState(false);

  const employeeGroupId = data?.employeeGroupId;
  const {
    benefitGroup,
    name: benefitDefaultName,
    description: benefitDefaultDescription,
    relationBenefitTypeConfiguration,
  } = data?.benefit || {};

  const companyName = useCompanyName();
  const benefitGroupIdValue = getIdFromIri(benefitGroup, BENEFIT_GROUP_IRI_PREFIX);
  const {
    benefitDescription: descriptionFromGroup,
  } = useBenefitGroups(
    false,
    'id',
    benefitGroupIdValue,
    false,
    !benefitGroupIdValue,
  )[0] || {};

  const submit = async () => {
    try {
      const body = parseBenefitEmployeeGroupDataToBackend({ ...data });
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/benefit-employee-groups/${benefitEmployeeGroupId}`,
        'PATCH',
        {
          body: {
            ...body,
            benefit: undefined,
          },
        },
      );
      dynamicNotification(__('Pomyślnie zapisano abonament'));
      const newData = parseBenefitEmployeeGroupDataFromBackend(res);
      setData({ ...newData });
      setOriginalData({ ...newData });
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać abonamentu'), 'error');
    }
  };
  const employeeGroup = useEmployeeGroups(false, 'id', employeeGroupId, false, !employeeGroupId)[0] || {};

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  const onChangeEmployerPriceType = (key, value) => {
    if (value === EMPLOYEER_PRICE_TYPE_CHOICE && data.method === EMPLOYEE_GROUP_METHOD_CO_FINANCED) {
      const updatedData = { ...data };
      updatedData[key] = value;
      updatedData.method = null;
      setData(updatedData);
    } else {
      onChange(key, value);
    }
  };

  useEffect(() => {
    setIsFetched(false);
  }, [benefitEmployeeGroupId]);
  const isPriceEmployeeChoice = data.employerPriceType === EMPLOYEER_PRICE_TYPE_CHOICE;

  const formData = { ...data };
  if (data.useDefaultName) {
    formData.name = benefitDefaultName || '';
  }
  if (data.useDefaultDescription) {
    formData.description = benefitDefaultDescription || descriptionFromGroup || '';
  }
  if (isPriceEmployeeChoice) {
    formData.employeePrice = null;
    formData.employerPrice = null;
  }
  const isRelationBenefitTypeAuto = relationBenefitTypeConfiguration === RELATION_BENEFIT_TYPE_AUTO;

  return (
    <DataLoading
      service={SUBSCRIPTION_MANAGEMENT_SERVICE}
      endpoint={`/benefit-employee-groups/${benefitEmployeeGroupId}`}
      fetchedData={isFetched}
      mockDataEndpoint="/benefit/employee-group-edit"
      updateData={(res) => {
        const newData = parseBenefitEmployeeGroupDataFromBackend(res);
        setData({ ...newData });
        setOriginalData({ ...newData });
        setIsFetched(true);
      }}
    >
      <PageTitle
        heading={`Edycja abonamentu ${originalData.name || employeeGroup?.name} dla grupy pracowniczej ${employeeGroup?.name} `}
        breadcrumbsHeading="Edycja abonamentu dla grupy pracowniczej"
        pushToHistory
        historyElementType="edit"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          {
            title: 'Świadczenia cykliczne',
            link: `/company/edit/${companyId}/subscriptions`,
          },
          {
            title: 'Świadczenia abonamentowe',
            link: `/company/edit/${companyId}/subscriptions/benefits/${data?.employeeGroupId}`,
          },
        ]}
      />
      <Form
        id="editSubscriptionForm"
        data={formData}
        config={{
          defaultOnChange: onChange,
          title: 'Edycja abonamentu',
          onSubmit: submit,
          additionalValidation: (invalidFields, setInvalidFields) => {
            const newInvalidFields = { ...invalidFields };
            let isValid = true;
            if (isRelationBenefitTypeAuto && [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE].includes(data.method)) {
              newInvalidFields.method = __('Wybrano niedostępną opcję');
              isValid = false;
            } else if (data.employerPriceType === EMPLOYEER_PRICE_TYPE_CHOICE && data.method === EMPLOYEE_GROUP_METHOD_CO_FINANCED) {
              newInvalidFields.method = __('Wybrano niedostępną opcję');
              isValid = false;
            }
            if (!isValid) {
              setInvalidFields(newInvalidFields);
            }

            return isValid;
          },
          buttons: [
            {
              text: 'Zapisz',
              type: 'submit',
              id: 'editSubscriptionSubmit',
              permission: subscriptionBenefitEmployeeGroupPermissionWrite,
            },
          ],
          formGroups: [
            {
              title: 'Podstawowe informacje',
              formElements: [
                {
                  layout: LAYOUT_ONE_COLUMN,
                  formElements: [
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: [
                        {
                          id: 'active',
                          type: 'boolean',
                          label: 'Świadczenie aktywne we wskazanej grupie pracowniczej',
                        },
                        {
                          id: 'name',
                          type: 'text',
                          label: 'Nazwa benefitu:',
                          validation: ['required'],
                          translatable: {
                            scope: 'company-management_subscription_subscriptionName',
                          },
                          inputSwitcher: {
                            onChange: (field, checked) => {
                              onChange('useDefaultName', checked);
                            },
                            disableIfChecked: true,
                            switcherValue: data.useDefaultName,
                            label: 'z ustawień abonamentu',
                          },
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
                              onChange('useDefaultDescription', checked);
                            },
                            disableIfChecked: true,
                            switcherValue: data.useDefaultDescription,
                            label: 'z ustawień abonamentu',
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
                {
                  layout: LAYOUT_ONE_COLUMN,
                  formElements: [{
                    id: 'employeeGroupId',
                    label: 'Grupa pracownicza',
                    type: 'autocomplete',
                    options: [
                      {
                        value: employeeGroupId,
                        label: employeeGroup?.name || employeeGroupId,
                      },
                    ],
                    validation: ['required'],
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'employerPriceType',
                    label: 'Koszt świadczenia:',
                    type: 'radio',
                    options: employerPriceTypeOptions,
                    onChange: onChangeEmployerPriceType,
                    validation: ['required'],
                  },
                  {
                    id: 'priceVariants',
                    type: 'text',
                    label: 'Kwoty do wyboru (rozdzielone średnikiem):',
                    depends: {
                      field: 'employerPriceType',
                      value: EMPLOYEER_PRICE_TYPE_CHOICE,
                    },
                    validation: ['required', 'numberList'],
                  },
                  {
                    id: 'commissionPercentage',
                    type: 'text',
                    label: 'Procent prowizji:',
                    depends: {
                      field: 'employerPriceType',
                      value: EMPLOYEER_PRICE_TYPE_CHOICE,
                    },
                    valueFormatter: 'integer',
                  },
                  {
                    id: 'employerPriceAlternativeText',
                    type: 'text',
                    label: 'Komunikat:',
                    depends: {
                      field: 'employerPriceType',
                      value: EMPLOYEER_PRICE_TYPE_HIDDEN,
                    },
                  }],
                },
                {
                  layout: LAYOUT_ONE_COLUMN,
                  formElements: [
                    {
                      id: 'method',
                      type: 'radio',
                      label: 'Sposób opłacania dla wskazanej grupy pracowniczej:',
                      options: [
                        {
                          value: EMPLOYEE_GROUP_METHOD_EMPLOYER,
                          label: 'pracodawca',
                        },
                        {
                          value: EMPLOYEE_GROUP_METHOD_EMPLOYEE,
                          label: 'pracownik',
                          disabled: isRelationBenefitTypeAuto,
                          tooltip: isRelationBenefitTypeAuto
                            ? { content: __('Świadczenie automatyczne nie może być opłacane przez pracownika') } : null,
                        },
                        {
                          value: EMPLOYEE_GROUP_METHOD_CO_FINANCED,
                          label: 'współfinansowany z pracodawcą',
                          disabled: isRelationBenefitTypeAuto || isPriceEmployeeChoice,
                          tooltip: isRelationBenefitTypeAuto || isPriceEmployeeChoice
                            ? {
                              content: isRelationBenefitTypeAuto
                                ? __('Świadczenie automatyczne nie może być opłacane przez pracownika')
                                : __('Opcja niedostępna dla wskazanego rodzaju kosztu świadczenia'),
                            } : null,

                        },
                      ],
                      validation: ['required'],
                    },
                    {
                      layout: LAYOUT_TWO_COLUMNS,
                      formElements: [
                        {
                          id: 'employeePrice',
                          type: 'text',
                          label: 'Pracownik:',
                          suffix: 'PLN',
                          valueFormatter: 'float',
                          displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE]
                            .includes(data.method),
                          props: {
                            disabled: isPriceEmployeeChoice,
                          },
                        },
                        {
                          id: 'employeePayrollNumber',
                          type: 'text',
                          displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE]
                            .includes(data.method),
                          label: 'Składnik płacowy:',
                          validation: ['required', { method: 'minLength', args: [3] }],
                        },
                      ],
                    },
                    {
                      layout: LAYOUT_TWO_COLUMNS,
                      formElements: [
                        {
                          id: 'employerPrice',
                          type: 'text',
                          label: data.method === EMPLOYEE_GROUP_METHOD_EMPLOYER ? 'Pracodawca:' : 'Pracodawca/ZFŚS:',
                          suffix: 'PLN',
                          valueFormatter: 'float',
                          props: {
                            disabled: isPriceEmployeeChoice,
                          },
                          displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYER]
                            .includes(data.method),
                        },
                        {
                          id: 'employerPayrollNumber',
                          type: 'text',
                          validation: ['required', { method: 'minLength', args: [3] }],
                          displayCondition: [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYER]
                            .includes(data.method),
                          label: 'Składnik płacowy:',
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
