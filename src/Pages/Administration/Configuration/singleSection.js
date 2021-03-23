import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { Card, Form, CardBody } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import { CONFIGURATION_SERVICE, restApiRequest } from '../../../utils/Api';
import __ from '../../../utils/Translations';
import ConfigForm, { filterSchema, getScopeCode } from './configForm';
import ContentLoading from '../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../utils/Notifications';
import validate from '../../../utils/Validation';
import { scrollToInvalid } from '../../../Components/Form';
import mockSchema from './mockSchema';
import FormTitle from '../../../Components/Form/FormTitle';
import RbsButton from '../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { parseDataFromBackend, parseDataToBackend, parseDefaultDataFromBackend } from './utils';
import ScopeSwitcher from '../../../Components/ScopeSwitcher';

export default function SingleSectionConfiguration({
  scope, breadcrumbs, sectionId, heading, breadcrumbsHeading, showSwitcher, changeScope,
}) {
  const [data, setData] = useState({});
  const [defaultData, setDefaultData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [invalidFields, setInvalidFields] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [schema, setSchema] = useState([]);
  const [filteredSchema, setFilteredSchema] = useState([]);
  const updateData = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  };

  const scopeCode = getScopeCode(scope);

  useEffect(() => {
    setLoadingSchema(true);
    restApiRequest(
      CONFIGURATION_SERVICE,
      '/config-schema',
      'GET',
      {},
      mockSchema,
    )
      .then((res) => {
        setSchema(res);
        setLoadingSchema(false);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać schematu konfiguracji'), 'error'));
  }, [setSchema]);

  useEffect(() => {
    setFilteredSchema(filterSchema(schema, scopeCode));
  }, [schema, setFilteredSchema, scopeCode]);

  const validateField = useCallback((id, value, validation) => {
    if (!validation) {
      return;
    }
    const message = validate(value, validation);
    if (message === invalidFields[id] || (!message && !invalidFields[id])) {
      return;
    }
    const updatedObject = { ...invalidFields };
    if (message) {
      updatedObject[id] = message;
    } else {
      delete updatedObject[id];
    }
    setInvalidFields(updatedObject);
  }, [setInvalidFields, invalidFields]);

  useEffect(() => {
    const params = {};
    if (scope.companyId) {
      params.companyId = scope.companyId;
    }
    if (scope.employeeGroupId) {
      params.employeeGroupId = scope.employeeGroupId;
    }
    setLoadingData(true);
    restApiRequest(
      CONFIGURATION_SERVICE,
      '/get-config-records',
      'GET',
      {
        params,
      },
      [],
    )
      .then((res) => {
        const result = parseDataFromBackend(res, sectionId);
        setData(result);
        setOriginalData(result);
        setLoadingData(false);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać konfiguracji'), 'error'));
  }, [setData, scope.companyId, scope.employeeGroupId, sectionId]);

  useEffect(() => {
    setDefaultData({});
    if (scope.companyId) {
      const params = {};
      if (scope.employeeGroupId) {
        params.companyId = scope.companyId;
      }
      restApiRequest(
        CONFIGURATION_SERVICE,
        '/get-config',
        'GET',
        {
          params,
        },
        {},
      )
        .then((res) => {
          setDefaultData(parseDefaultDataFromBackend(res));
        })
        .catch((e) => console.error(e));
    }
  }, [setDefaultData, scope.companyId, scope.employeeGroupId]);

  const save = async () => {
    setIsSaving(true);
    return restApiRequest(
      CONFIGURATION_SERVICE,
      '/update-config',
      'POST',
      {
        body: {
          companyId: scope.companyId || null,
          employeeGroupId: scope.employeeGroupId || null,
          data: parseDataToBackend(data),
        },
      },
      {},
    )
      .then(() => {
        setIsSaving(false);
        dynamicNotification('Pomyślnie zapisano konfigurację');
      })
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się zapisać konfiguracji'), 'error');
        setIsSaving(false);
      });
  };

  const section = filteredSchema.find((schemaSection) => schemaSection.id === sectionId);

  const validateForm = () => {
    const validationResult = {};
    const formElementsToValidate = [];
    if (section?.children) {
      section.children.forEach((group) => {
        if (group.children) {
          group.children.forEach((field) => {
            formElementsToValidate.push({
              id: `${section.id}/${group.id}/${field.id}`,
              validation: field.validation || [],
              type: field.type || '',
            });
          });
        }
      });
    }
    formElementsToValidate.forEach(({
      id, validation, type,
    }) => {
      const hasValue = data[id] !== null && data[id] !== undefined;
      if (hasValue && validation) {
        const valueToCheck = type.toLowerCase()
          .includes('range') ? {
            from: data[`${id}From`],
            to: data[`${id}To`],
          } : data[id];
        const message = validate(valueToCheck, validation);
        if (message) {
          validationResult[id] = message;
        }
      }
    });
    setInvalidFields(validationResult);
    return Object.keys(validationResult).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSaving) {
      const isValid = validateForm();
      if (isValid) {
        setIsSaving(true);
        await save();
      } else {
        scrollToInvalid();
      }
      setIsSaving(false);
    }
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
          heading={heading}
          breadcrumbsHeading={breadcrumbsHeading}
          breadcrumbs={breadcrumbs}
        />
        <ContentLoading
          show={loadingSchema || loadingData || isSaving}
        >
          <Form onSubmit={submit} data-t1="configurationSectionForm">
            {section ? (
              <Card>
                {
                  showSwitcher ? (
                    <CardBody>
                      <ScopeSwitcher skipCompany scope={scope} changeScope={changeScope} />
                    </CardBody>
                  ) : null
                }
                <FormTitle
                  stickyTitle
                  title={section.label}
                  buttons={[
                    <RbsButton
                      key="submit"
                      data-t1="submitConfiguration"
                      disabled={isSaving}
                      size="lg"
                      color="success"
                      type="submit"
                    >
                      {__('Zapisz')}
                    </RbsButton>,
                  ]}
                />
                <CardBody>
                  <ConfigForm
                    sectionId={sectionId}
                    data={data}
                    defaultData={defaultData}
                    loadingData={loadingData}
                    invalidFields={invalidFields}
                    validateField={validateField}
                    originalData={originalData}
                    updateData={updateData}
                    groupsConfig={section.groups}
                    scope={scope}
                  />
                </CardBody>
              </Card>
            ) : null}
          </Form>
        </ContentLoading>
      </CSSTransitionGroup>
    </>
  );
}
SingleSectionConfiguration.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  })).isRequired,
  scope: PropTypes.shape({
    companyId: PropTypes.string,
    employeeGroupId: PropTypes.string,
  }).isRequired,
  sectionId: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  breadcrumbsHeading: PropTypes.string,
  showSwitcher: PropTypes.bool,
  changeScope: PropTypes.func,
};
SingleSectionConfiguration.defaultProps = {
  breadcrumbsHeading: null,
  showSwitcher: false,
  changeScope: null,
};
