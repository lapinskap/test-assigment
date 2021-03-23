import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../../../Components/Form/FormGroup';
import { getUserConfirmationPopup } from '../../../Components/UserConfirmationPopup';
import __ from '../../../utils/Translations';
import ContentLoading from '../../../Components/Loading/contentLoading';
import { restApiRequest, SSO_SERVICE } from '../../../utils/Api';
import isObject from '../../../utils/jsHelpers/isObject';

export default function ConfigForm({
  data, updateData, setIsEdited, sectionId, groupsConfig, loadingData, defaultData, originalData, invalidFields, validateField, scope,
}) {
  const [schemaDefaultValues, setSchemaDefaultValues] = useState({});
  const [fetchingData, setFetchingData] = useState(false);
  const onChange = (key, value) => {
    if (value === true || value === false) {
      updateData(key, +value);
    } else {
      updateData(key, value);
    }
    setIsEdited(true);
  };
  useEffect(() => {
    const newSchemaDefaultValues = {};
    groupsConfig.forEach((groupConfig) => {
      const groupId = groupConfig.id;
      groupConfig.fields.forEach((fieldConfig) => {
        const fieldId = `${sectionId}/${groupId}/${fieldConfig.id}`;
        if (fieldConfig.defaultValue !== undefined) {
          newSchemaDefaultValues[fieldId] = fieldConfig.defaultValue;
        }
      });
    });
    setSchemaDefaultValues(newSchemaDefaultValues);
  }, [setSchemaDefaultValues, groupsConfig, sectionId]);

  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  });

  const getSpecialAction = ({ specialAction, confirmation }) => {
    if (specialAction) {
      switch (specialAction) {
        case 'IP_RESTRICTION':
          return (key, value) => {
            if (value === false) {
              onChange(key, value);
            } else {
              setFetchingData(true);
              restApiRequest(SSO_SERVICE, '/ip-address-restrictions/allowed', 'GET', {}, false)
                .then((allowed) => {
                  setFetchingData(false);
                  if (allowed) {
                    onChange(key, value);
                  } else {
                    getUserConfirmationPopup(
                      __('Uwaga! Twój adres IP nie znajduje się w zakresie, dokonując tej zmiany stracisz dostęp do panelu  OMB.'),
                      (confirmed) => {
                        if (confirmed) {
                          onChange(key, value);
                        }
                      },
                      __('Czy jesteś pewien?'),
                    );
                  }
                });
            }
          };
        default:
          return null;
      }
    } else if (confirmation) {
      const { onValue, message } = confirmation;
      return (key, value) => {
        if (onValue === undefined || onValue === value) {
          getUserConfirmationPopup(
            __(message ?? 'Czy na pewno chcesz dokonać tej zmiany?'),
            (confirm) => confirm && onChange(key, value),
            __('Wymagane potwierdzenie'),
          );
        } else {
          onChange(key, value);
        }
      };
    }
    return null;
  };
  if (loadingData) {
    return null;
  }

  const allData = { ...schemaDefaultValues, ...defaultData, ...filteredData };
  const formData = {};
  Object.keys(allData).forEach((key) => {
    const value = allData[key];
    if (isObject(value)) {
      Object.keys(value).forEach((valueKey) => {
        formData[`${key}${valueKey.charAt(0).toUpperCase()}${valueKey.slice(1)}`] = value[valueKey];
      });
    } else {
      formData[key] = value;
    }
  });
  const switcherLabel = getSwitcherLabel(scope);
  return groupsConfig.map((groupConfig) => {
    const groupId = groupConfig.id;
    return (
      <ContentLoading show={fetchingData} useBlur={false} key={groupId}>
        <FormGroup
          key={groupId}
          noCards
          invalidFields={invalidFields}
          validateField={validateField}
          defaultOnChange={onChange}
          title={groupConfig.label}
          data={formData}
          formElements={groupConfig.fields.map((fieldConfig) => {
            const fieldId = `${sectionId}/${groupId}/${fieldConfig.id}`;
            return ({
              id: fieldId,
              label: fieldConfig.label && fieldConfig.type !== 'boolean' ? `${fieldConfig.label}:` : fieldConfig.label,
              type: fieldConfig.type,
              options: fieldConfig.options,
              tooltip: fieldConfig.tooltip ? {
                content: fieldConfig.tooltip,
              } : null,
              validation: fieldConfig.validation || null,
              props: {
                min: fieldConfig.min || null,
                max: fieldConfig.max || null,
              },
              depends: fieldConfig.depends,
              onChange: getSpecialAction(fieldConfig) || null,
              inputSwitcher: {
                onChange: (key, isChecked) => {
                  if (isChecked) {
                    updateData(key, null);
                  } else {
                    const newValue = originalData[key] || '';
                    updateData(key, newValue);
                  }
                  setIsEdited(true);
                },
                checkedByDefault: (data[fieldId] === null) || (data[fieldId] === undefined),
                disableIfChecked: true,
                label: switcherLabel,
              },
              translatable: fieldConfig.translatable ? getTranslatable(fieldConfig.type, fieldId, scope) : null,
            });
          })}
        />
      </ContentLoading>
    );
  });
}

const getTranslatable = (fieldType, fieldName, { companyId = 'default', employeeGroupId = 'default' }) => {
  if (fieldType === 'wysiwyg') {
    return {
      code: `configuration:${fieldName}:${companyId}:${employeeGroupId}`,
      isCms: true,
    };
  }
  return {
    scope: `configuration:${fieldName}`,
  };
};
const getSwitcherLabel = ({ companyId = null, employeeGroupId = null }) => {
  if (employeeGroupId) {
    return __('Użyj wartości z ustawień firmy');
  }
  if (companyId) {
    return __('Użyj wartości z ustawień domyślnych');
  }

  return __('Użyj wartości z ustawień programistycznych');
};

export const filterSchema = (schema, scopeCode) => schema.map((section) => {
  if (!section.children || !section.children.length) {
    return null;
  }
  const groups = section.children.map((group) => {
    if (!group.children || !group.children.length) {
      return null;
    }
    const fields = group.children.filter((field) => {
      switch (scopeCode) {
        case EMPLOYEE_GROUP_SCOPE:
          return field.showInEmployeeGroup !== false;
        case COMPANY_SCOPE:
          return field.showInCompany !== false;
        case DEFAULT_SCOPE:
        default:
          return field.showInDefault !== false;
      }
    })
      .filter(Boolean);
    return fields.length ? {
      ...group,
      fields,
    } : null;
  })
    .filter(Boolean);
  return groups.length ? {
    ...section,
    groups,
  } : null;
})
  .filter(Boolean);

export const DEFAULT_SCOPE = 'default';
export const COMPANY_SCOPE = 'company';
export const EMPLOYEE_GROUP_SCOPE = 'group';
export const getScopeCode = ({ companyId, employeeGroupId }) => {
  if (companyId && employeeGroupId) {
    return EMPLOYEE_GROUP_SCOPE;
  }
  if (companyId) {
    return COMPANY_SCOPE;
  }
  return DEFAULT_SCOPE;
};

ConfigForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  invalidFields: PropTypes.object.isRequired,
  validateField: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  defaultData: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  originalData: PropTypes.object.isRequired,
  loadingData: PropTypes.bool,
  setIsEdited: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
  groupsConfig: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  scope: PropTypes.shape({
    companyId: PropTypes.string,
    employeeGroupId: PropTypes.string,
  }).isRequired,
};
ConfigForm.defaultProps = {
  setIsEdited: () => {
  },
  loadingData: false,
};
