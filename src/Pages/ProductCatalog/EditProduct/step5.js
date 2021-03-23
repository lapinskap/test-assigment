/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';
import Form from '../../../Components/Form/index';
import { LAYOUT_TWO_COLUMNS } from '../../../Components/Layouts';
import __ from '../../../utils/Translations';
import { catalogProductPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import useConfigValue from '../../../utils/hooks/configuration/useConfigValue';

const defaultLabelValues = {
  firstname: 'Imię',
  lastname: 'Nazwisko',
  email: 'Email',
  phone: 'Telefon',
  dayOfBirth: 'Data urodzenia',
  shipmentAddress: 'Adres koresp.',
  checkInAddress: 'Adres zameldowania',
};

const AGREEMENT_FIELD_PREFIX = 'agreement_form_';
const FORM_FIELD_TYPE_PREFIX = 'form_field_type_';
const FORM_FIELD_LABEL_PREFIX = 'form_field_label_';
const FORM_FIELD_CODE_PREFIX = 'form_field_code_';
const FORM_FIELD_IS_CUSTOM_PREFIX = 'form_field_is_custom_';

export default function AttachmentsAndLinks({
  data, setData, next, title,
}) {
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const updateAgreementField = (key, value) => {
    const index = +key.replace(AGREEMENT_FIELD_PREFIX, '');
    const agreementsData = data.agreementsData || [];
    agreementsData[index] = value;
    onChange('agreementsData', agreementsData);
  };

  const othersDefaultStatement = useConfigValue('product-catalog/default-data/statement') || false;

  let agreementsFields = [];
  const agreementsFieldsData = {};
  if (data && data.agreementsData) {
    agreementsFields = data.agreementsData.map((agreement, index) => {
      const fieldId = `${AGREEMENT_FIELD_PREFIX}${index}`;
      agreementsFieldsData[fieldId] = agreement;
      const removeButton = (
        <i
          className="lnr-trash btn-icon-wrapper cursor-pointer"
          role="presentation"
          onClick={() => removeAgreement(index)}
        />
      );
      return {
        type: 'textarea',
        id: fieldId,
        onChange: updateAgreementField,
        label: (
          <>
            {removeButton}
            {' '}
            {`Treść zgody ${index + 1}:`}
          </>
        ),
        validation: ['required'],
        depends: {
          functionValidation: (dataValidation) => Boolean(dataValidation.showAgreements),
        },
      };
    });
  }
  const addAgreement = () => {
    const updatedAgreements = data.agreementsData || [];
    updatedAgreements.push('');
    onChange('agreementsData', updatedAgreements);
  };
  const removeAgreement = (index) => {
    const updatedAgreements = data.agreementsData || [];
    onChange('agreementsData', updatedAgreements.filter((el, elIndex) => elIndex !== index));
  };

  const onChangeOthersStatementIsDefault = (checked) => {
    onChange('otherStatementIsDefault', checked);
  };

  const updateFormFieldType = (key, value) => {
    const index = +key.replace(FORM_FIELD_TYPE_PREFIX, '');
    const fieldsData = data.fieldsData || [];
    fieldsData[index].fieldType = value;
    fieldsData[index].label = defaultLabelValues[value] || '';
    fieldsData[index].isCustom = value === 'newValue';
    onChange('fieldsData', fieldsData);
  };

  const updateFormFieldLabel = (key, value) => {
    const index = +key.replace(FORM_FIELD_LABEL_PREFIX, '');
    const fieldsData = data.fieldsData || [];
    fieldsData[index].label = value;
    onChange('fieldsData', fieldsData);
  };

  const updateFormFieldCode = (key, value) => {
    const code = +key.replace(FORM_FIELD_CODE_PREFIX, '');
    const fieldsData = data.fieldsData || [];
    fieldsData[code].code = value;
    onChange('fieldsData', fieldsData);
  };

  let formFields = [];
  const formFieldsData = {};
  if (data && data.fieldsData) {
    formFields = data.fieldsData.map(({
      fieldType = '', label = '', code = '', isCustom = false,
    }, index) => {
      const fieldTypeId = `${FORM_FIELD_TYPE_PREFIX}${index}`;
      const fieldLabelId = `${FORM_FIELD_LABEL_PREFIX}${index}`;
      const fieldCode = `${FORM_FIELD_CODE_PREFIX}${index}`;
      const fieldIsCustom = `${FORM_FIELD_IS_CUSTOM_PREFIX}${index}`;
      formFieldsData[fieldTypeId] = fieldType;
      formFieldsData[fieldLabelId] = label;
      formFieldsData[fieldCode] = code;
      formFieldsData[fieldIsCustom] = isCustom;
      const removeButton = (
        <i
          className="lnr-trash btn-icon-wrapper cursor-pointer"
          role="presentation"
          onClick={() => removeFormField(index)}
        />
      );
      return {
        layout: LAYOUT_TWO_COLUMNS,
        formElements: [
          {
            type: 'select',
            id: fieldTypeId,
            onChange: updateFormFieldType,
            options: formFielTypeOptions,
            label: (
              <>
                {removeButton}
                {' '}
                {__('Typ pola')}
                :
              </>
            ),
            validation: ['required'],
          },
          {
            type: 'text',
            id: fieldLabelId,
            onChange: updateFormFieldLabel,
            label: 'Etykieta pola:',
            validation: ['required'],
            depends: {
              functionValidation: (dataValidation) => Boolean(dataValidation[fieldTypeId]),
            },
          },
          {
            type: 'text',
            className: 'm-0',
            id: fieldCode,
            onChange: updateFormFieldCode,
            label: 'Kod pola:',
            validation: ['required'],
            depends: {
              field: fieldTypeId,
              value: 'newValue',
            },
          },
        ],
      };
    });
  }

  const addFormField = () => {
    const updatedFields = data.fieldsData || [];
    updatedFields.push({ fieldType: null, label: '' });
    onChange('fieldsData', updatedFields);
  };
  const removeFormField = (index) => {
    const updatedFields = data.fieldsData || [];
    onChange('fieldsData', updatedFields.filter((el, elIndex) => elIndex !== index));
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
        <Form
          id="step5Form"
          data={{
            ...data,
            ...agreementsFieldsData,
            ...formFieldsData,
            othersDefaultStatement: data?.otherStatementIsDefault ? othersDefaultStatement : data?.othersStatement,
          }}
          config={{
            stickyTitle: false,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            noCards: true,
            onSubmit: next,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'step5FormSubmit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'boolean',
                    isCheckbox: true,
                    id: 'enabledFormConfiguration',
                    label: 'Konfiguracja produktu z formularzem',
                  },
                  {
                    displayCondition: Boolean(data.enabledFormConfiguration === true),
                    component: <h6 key="forms" className="m-3"><strong>Formularze</strong></h6>,
                  },
                  ...formFields,
                  {
                    displayCondition: Boolean(data.enabledFormConfiguration === true),
                    component: (
                      <Button key="add_field" color="link" onClick={addFormField}>
                        <i className="pe-7s-plus pe-3x pe-va" />
                        {' '}
                        Dodaj kolejne pole
                      </Button>
                    ),
                  },
                ],
              },
              {
                formElements: data.enabledFormConfiguration === true ? (
                  [
                    {
                      type: 'boolean',
                      isCheckbox: true,
                      id: 'canBuyForOthers',
                      label: 'Os. towarzysząca - możliwość zakupu bez kodu dla pracownika',
                    },
                    {
                      type: 'date',
                      id: 'formDataEditLastDay',
                      label: 'Ostatni dzień edycji danych w formularzu:',
                    },
                    {
                      type: 'boolean',
                      isCheckbox: true,
                      id: 'disabledEmployeeLabel',
                      label: 'Wyłącz edycję pracownika',
                    },
                    {
                      type: 'text',
                      id: 'employeeMaxCodesCount',
                      label: 'Maksymalna ilość kodów dla pracownika:',
                      valueFormatter: 'integer',
                    },
                    {
                      type: 'boolean',
                      isCheckbox: true,
                      id: 'disabledOthersLabel',
                      label: 'Wyłącz edycję osoby towarzyszącej',
                    },
                    {
                      type: 'wysiwyg',
                      id: 'othersStatement',
                      label: 'Oświadczenie dla osoby towarzyszącej:',
                      inputSwitcher: {
                        label: 'Użyj domyślnej treści oświadczenia',
                        onChange: onChangeOthersStatementIsDefault,
                        disableIfChecked: true,
                        switcherValue: data.othersStatementIsDefault,
                      },
                    },
                    {
                      type: 'text',
                      id: 'othersMaxCodesCount',
                      label: 'Maksymalna ilość kodów dla osoby towarzyszącej:',
                      valueFormatter: 'integer',
                    },
                    {
                      component:
                    <h6 className="mt-3" key="Fields"><strong>Zgody</strong></h6>,
                    },
                    {
                      type: 'boolean',
                      isCheckbox: true,
                      id: 'showAgreements',
                      label: 'Wyświetl zgodę przy zakupie kodu z formularzem',
                    },
                    ...agreementsFields,
                    {
                      displayCondition: Boolean(data.showAgreements),
                      component: (
                        <Button key="add_Fields" color="link" onClick={addAgreement}>
                          <i className="pe-7s-plus pe-3x pe-va" />
                          {' '}
                          Dodaj nową zgodę
                        </Button>
                      ),
                    },
                  ]) : [],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

const formFielTypeOptions = [
  { value: 'firstname', label: 'Imię' },
  { value: 'lastname', label: 'Nazwisko' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefon' },
  { value: 'dayOfBirth', label: 'Data urodzenia' },
  { value: 'shipmentAddress', label: 'Adres koresp.' },
  { value: 'checkInAddress', label: 'Adres zameldowania' },
  { value: 'newValue', label: 'Zdefiniuj nową wartość' },
];

AttachmentsAndLinks.propTypes = {
  next: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  title: PropTypes.string,
};
AttachmentsAndLinks.defaultProps = {
  next: () => {
  },
  title: null,
};
