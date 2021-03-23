import React, { useContext, useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Form from '../../../Components/Form';
import DataLoading from '../../../Components/Loading/dataLoading';
import Configurator from './Configurator';
import LanguagesTabs from './LanguagesTab';
import { defaultLanguage } from '../../../utils/Translations/translationUtils';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../utils/Api';
import {
  fetchTranslations, parseDataFromBackend, parseDataToBackend, saveTranslations,
} from './utils/utils';
import validate from './Configurator/validation';
import {
  subscriptionActiveFormGroupPermissionWrite, translationTranslateCmsPermissionWrite,
  translationTranslateSimplePermissionWrite,
} from '../../../utils/RoleBasedSecurity/permissions';
import { hasAccessTo } from '../../../utils/RoleBasedSecurity/filters';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';

export default function EditActiveForm({ match }) {
  const [data, setData] = useState(null);
  const { userInfo } = useContext(RbsContext);
  const [originalData, setOriginalData] = useState({});
  const [configuratorErrors, setConfiguratorErrors] = useState(null);
  const [language, setLanguage] = useState(defaultLanguage);
  const [translationData, setTranslationData] = useState({});
  const history = useHistory();

  const { formId } = match.params;
  const isNew = formId === '-1';
  const isDefaultLanguage = language === defaultLanguage;

  const translations = isDefaultLanguage ? null : (translationData[language] || null);
  const formData = isDefaultLanguage ? (data || {}) : { ...(data || {}), description: translations ? translations.description : null };

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  };

  const onChangeTranslations = (key, value) => {
    const updatedLanguageData = { ...(translations || {}) };
    updatedLanguageData[key] = value;
    const updatedTranslationsData = { ...translationData };
    updatedTranslationsData[language] = updatedLanguageData;
    setTranslationData(updatedTranslationsData);
  };

  const validateConfigurator = () => {
    const errors = validate(data?.configuration || []);
    if (errors !== null || configuratorErrors !== null) {
      setConfiguratorErrors(errors);
    }
    if (errors) {
      setLanguage(defaultLanguage);
    }
    return errors === null;
  };

  const validateField = (sectionId, field, value, message = null) => {
    let errors = configuratorErrors ? { ...configuratorErrors } : {};
    if (!value) {
      if (!errors[sectionId]) {
        errors[sectionId] = {};
      }
      errors[sectionId][field] = message || __('To pole jest wymagane');
      setConfiguratorErrors(errors);
    } else if (errors[sectionId] && errors[sectionId][field]) {
      delete errors[sectionId][field];
      if (Object.keys(errors[sectionId]).length === 0) {
        delete errors[sectionId];
        if (Object.keys(errors).length === 0) {
          errors = null;
        }
      }
      setConfiguratorErrors(errors);
    }
  };

  const validateFormField = (sectionId, fieldId, field, value) => {
    let errors = configuratorErrors ? { ...configuratorErrors } : {};
    if (!value) {
      if (!errors[sectionId]) {
        errors[sectionId] = {};
      }
      if (!errors[sectionId].field) {
        errors[sectionId].field = {};
      }
      if (!errors[sectionId].field[fieldId]) {
        errors[sectionId].field[fieldId] = {};
      }
      errors[sectionId].field[fieldId][field] = __('To pole jest wymagane');
      setConfiguratorErrors(errors);
    } else if (
      errors[sectionId] && errors[sectionId].field[fieldId]
        && errors[sectionId].field[fieldId] && errors[sectionId].field[fieldId][field]) {
      delete errors[sectionId].field[fieldId][field];
      if (Object.keys(errors[sectionId].field[fieldId]).length === 0) {
        delete errors[sectionId].field[field];
        if (Object.keys(errors[sectionId].field).length === 0) {
          delete errors[sectionId].field;
          if (Object.keys(errors[sectionId]).length === 0) {
            delete errors[sectionId];
            if (Object.keys(errors).length === 0) {
              errors = null;
            }
          }
        }
      }
      setConfiguratorErrors(errors);
    }
  };
  const submit = async () => {
    try {
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/active-forms' : `/active-forms/${formId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: parseDataToBackend(data),
        },
        {
          id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
        },
      );
      if (
        !isNew
          && hasAccessTo(userInfo, translationTranslateSimplePermissionWrite)
          && hasAccessTo(userInfo, translationTranslateCmsPermissionWrite)
      ) {
        await saveTranslations(translationData, formId, formData);
      }
      dynamicNotification(__('Pomyślnie zapisano formularz'));
      if (isNew) {
        history.push(`/active-forms/${res.id}`);
        setData(null);
      } else {
        const newData = parseDataFromBackend(res);
        setData({ ...newData });
        setOriginalData({ ...newData });
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać formularza'), 'error');
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
        heading={isNew ? 'Tworzenie formularza aktywnego' : `Edycja formularza aktywnego ${originalData.name} (${formId})`}
        breadcrumbs={[{ title: 'Lista formularzy aktywnych', link: '/active-forms' }]}
      />
      <DataLoading
        service={SUBSCRIPTION_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        isNew={isNew}
        updateData={async (res) => {
          const newData = parseDataFromBackend(res);
          setData({ ...newData });
          setOriginalData({ ...newData });
          setTranslationData(await fetchTranslations(formId));
        }}
        endpoint={`/active-forms/${formId}`}
        mockDataEndpoint="/active-forms/edit"
      >
        <Form
          id="activeFormEditForm"
          data={formData}
          config={{
            title: isNew ? 'Tworzenie formularza aktywnego' : 'Edycja formularza aktywnego',
            stickyTitle: true,
            onSubmit: submit,
            additionalValidation: validateConfigurator,
            buttons: [
              {
                color: 'primary',
                type: 'submit',
                text: 'Zapisz',
                permission: subscriptionActiveFormGroupPermissionWrite,
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'name',
                    label: 'Nazwa:',
                    type: 'text',
                    validation: ['required'],
                  },
                  {
                    component: <LanguagesTabs
                      key="languagesTab"
                      language={language}
                      setLanguage={setLanguage}
                      allowNotDefault={!isNew}
                    />,
                  },
                  {
                    id: 'description',
                    label: 'Opis:',
                    onChange: isDefaultLanguage ? null : onChangeTranslations,
                    type: 'wysiwyg',
                  },
                  {
                    component: <Configurator
                      key="configurator"
                      validateField={validateField}
                      validateFormField={validateFormField}
                      translations={translations?.configuration}
                      errors={configuratorErrors}
                      isDefaultLanguage={isDefaultLanguage}
                      configuration={data?.configuration}
                      update={(configuration) => (isDefaultLanguage
                        ? onChange('configuration', configuration)
                        : onChangeTranslations('configuration', configuration))}
                    />,
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </CSSTransitionGroup>
  );
}

EditActiveForm.propTypes = {
  match: matchPropTypes.isRequired,
};
