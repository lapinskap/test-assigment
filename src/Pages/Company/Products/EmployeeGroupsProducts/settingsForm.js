import React, {
  useState, useCallback, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form/index';
import { LAYOUT_TWO_COLUMNS, LAYOUT_THREE_COLUMNS, LAYOUT_ONE_COLUMN } from '../../../../Components/Layouts';
import EmployeeGroupContext from './employeeGroupContext';
import { employeeGroupProductConfigPermissionRead } from '../../../../utils/RoleBasedSecurity/permissions';

export default function BenefitsSettings({
  parentCategoryName, name: bankName, hasParent, originalData, onSubmit, treePath, isProductEdit, close,
}) {
  const [data, setData] = useState({});
  const [defaultData, setDefaultData] = useState({});
  const { data: contextData, paymentsConfig } = useContext(EmployeeGroupContext);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  useEffect(() => {
    setData(parseDataToForm(originalData, paymentsConfig, hasParent));
  }, [originalData, setData, paymentsConfig, hasParent]);

  useEffect(() => {
    let parentCategoryData = {};
    for (let i = 0; i < treePath.length; i += 1) {
      const categoryData = contextData[treePath[i]];
      if (categoryData && categoryData.id && !categoryData.useDefaultSettings) {
        parentCategoryData = categoryData;
        break;
      }
    }
    setDefaultData({
      ...parseDataToForm(parentCategoryData, paymentsConfig, hasParent),
      useDefaultSettings: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextData, setDefaultData, paymentsConfig, hasParent]);

  const renderFields = ({
    name, id, hasSecondPayrollNumber = true, hasCommission, hasFirstPayrollNumber = true,
  }) => {
    const { useDefaultSettings } = data;
    const isActive = Boolean(data[`${id}${FORM_KEY_SEPARATOR}active`]);
    return ({
      layout: hasSecondPayrollNumber || hasCommission ? LAYOUT_THREE_COLUMNS : LAYOUT_TWO_COLUMNS,
      layoutConfig: {
        sm: [3, 4],
      },
      formElements: [
        {
          id: `${id}${FORM_KEY_SEPARATOR}active`,
          type: 'boolean',
          isCheckbox: true,
          label: name,
          props: {
            disabled: useDefaultSettings,
          },
        },
        // {
        //   type: 'text',
        //   id: `${code}${FORM_KEY_SEPARATOR}commission`,
        //   label: 'Prowizja',
        //   placeholder: '0,00',
        //   suffix: '%',
        //   displayCondition: hasCommission === true,
        //   valueFormatter: 'float',
        //   props: {
        //     disabled: useDefaultSettings || !isActive,
        //   },
        // },
        {
          id: `${id}${FORM_KEY_SEPARATOR}payrollNumberFirst`,
          type: 'text',
          label: 'Pierwszy składnik płacowy',
          displayCondition: hasFirstPayrollNumber,
          props: {
            disabled: useDefaultSettings || !isActive,
          },
        },
        {
          id: `${id}${FORM_KEY_SEPARATOR}payrollNumberSecond`,
          type: 'text',
          label: 'Drugi składnik płacowy',
          displayCondition: hasSecondPayrollNumber,
          props: {
            disabled: useDefaultSettings || !isActive,
          },
        },
      ],
    });
  };
  // temporary solution untill backend returns correct data
  const bankInputs = paymentsConfig.map(renderFields);
  return (
    <>
      <Form
        id="employeeGroupProductForm"
        data={data.useDefaultSettings ? defaultData : data}
        config={{
          onSubmit: () => onSubmit(parseDataToBackend(data, paymentsConfig)),
          title: `Banki i składniki płacowe  w ramach ${isProductEdit ? 'produktu' : 'kategorii'}
          ${bankName} w wybranej grupie pracowniczej`,
          stickyTitle: false,
          isInPopup: isProductEdit,
          togglePopup: close,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              type: 'submit',
              id: 'employeeGroupProductFormSubmit',
              permission: employeeGroupProductConfigPermissionRead,
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              formElements: [
                {
                  type: 'boolean',
                  isCheckbox: true,
                  id: 'useDefaultSettings',
                  label: `Pobieraj konfigurację płatności z ustawień domyślnych kategorii ${parentCategoryName}`,
                  displayCondition: Boolean(hasParent),
                },
                {
                  type: 'boolean',
                  id: 'active',
                  label: 'Włączona',
                  props: {
                    disabled: data.useDefaultSettings,
                  },
                },
                {
                  layout: LAYOUT_TWO_COLUMNS,
                  formElements: [
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: bankInputs.slice(0, Math.ceil(bankInputs.length / 2)),
                    },
                    {
                      layout: LAYOUT_ONE_COLUMN,
                      formElements: bankInputs.slice(Math.ceil(bankInputs.length / 2)),
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    </>
  );
}

const parseDataToForm = ({ useDefaultSettings = false, active = false, settings = [] }, paymentConfig = [], hasParent) => {
  const result = {};
  const paymentsCodes = paymentConfig.map(({ id }) => id);
  result.useDefaultSettings = hasParent ? useDefaultSettings : false;
  result.active = active;
  settings.forEach(({
    active: activeSetting, commission, code, payrollNumberFirst, payrollNumberSecond,
  }) => {
    if (paymentsCodes.includes(code)) {
      result[`${code}${FORM_KEY_SEPARATOR}active`] = activeSetting;
      result[`${code}${FORM_KEY_SEPARATOR}payrollNumberFirst`] = payrollNumberFirst;
      if (payrollNumberSecond) {
        result[`${code}${FORM_KEY_SEPARATOR}payrollNumberSecond`] = payrollNumberSecond;
      }
      if (commission) {
        result[`${code}${FORM_KEY_SEPARATOR}commission`] = commission;
      }
    }
  });
  return result;
};

const parseDataToBackend = ({ useDefaultSettings = false, active = false, ...data }, paymentConfig = []) => {
  const result = { useDefaultSettings, active, settings: [] };
  paymentConfig.forEach(({
    hasCommission = false, hasSecondPayrollNumber = true, hasFirstPayrollNumber = true, id, type,
  }) => {
    const methodConfig = {};
    methodConfig.active = Boolean(data[`${id}${FORM_KEY_SEPARATOR}active`]);
    methodConfig.type = type || 'BANK_OF_POINTS';
    methodConfig.code = id;
    if (hasFirstPayrollNumber) {
      methodConfig.payrollNumberFirst = data[`${id}${FORM_KEY_SEPARATOR}payrollNumberFirst`];
    }
    if (hasSecondPayrollNumber) {
      methodConfig.payrollNumberSecond = data[`${id}${FORM_KEY_SEPARATOR}payrollNumberSecond`];
    }
    if (hasCommission) {
      methodConfig.commission = data[`${id}${FORM_KEY_SEPARATOR}commission`];
    }
    result.settings.push(methodConfig);
  });
  return result;
};

const FORM_KEY_SEPARATOR = '||';

BenefitsSettings.propTypes = {
  name: PropTypes.string.isRequired,
  isProductEdit: PropTypes.bool,
  close: PropTypes.func,
  treePath: PropTypes.arrayOf(PropTypes.string),
  hasParent: PropTypes.bool.isRequired,
  parentCategoryName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  originalData: PropTypes.object.isRequired,
};

BenefitsSettings.defaultProps = {
  isProductEdit: false,
  close: PropTypes.func,
  parentCategoryName: null,
  treePath: [],
};
