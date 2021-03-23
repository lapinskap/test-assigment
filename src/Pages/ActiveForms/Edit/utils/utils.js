// eslint-disable-next-line import/prefer-default-export
import isJson from '../../../../utils/jsHelpers/isJson';
import { SIMPLE_VALUE_TYPE } from '../../../Translation/Simple';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import mergeDeep from '../../../../utils/jsHelpers/mergeDeep';

export const getRandomId = () => Math.random().toString(36).substr(2, 5);

export const parseDataFromBackend = (data) => {
  let configuration = [];
  if (isJson(data.configuration)) {
    configuration = JSON.parse(data.configuration);
    if (!Array.isArray(configuration)) {
      configuration = [];
    }
  }
  return { ...data, configuration };
};
export const parseDataToBackend = ({ configuration, ...data }) => ({ ...data, configuration: configuration ? JSON.stringify(configuration) : '' });

export const parseTranslationsToBackend = (translations, formId, formData) => {
  const descriptionTranslations = [];
  const simpleTranslations = [];
  const scope = getTranslationScope(formId);

  Object.keys(translations).forEach((language) => {
    const languageTranslations = translations[language];
    if (languageTranslations.description) {
      descriptionTranslations.push({
        language,
        translation: languageTranslations.description,
        scope,
        code: getTranslationFieldCode(formId, 'description'),
      });
    }
    Object.keys(languageTranslations?.configuration || {}).forEach((sectionId) => {
      const sectionData = languageTranslations.configuration[sectionId];
      const section = (formData?.configuration || []).find((el) => el.id === sectionId) || {};
      Object.keys(sectionData).forEach((field) => {
        if (field === 'fields') {
          Object.keys(sectionData.fields).forEach((fieldId) => {
            const fieldData = sectionData.fields[fieldId];
            const fieldFormData = section.fields.find((el) => el.id === fieldId) || {};
            Object.keys(fieldData).forEach((fieldCode) => {
              simpleTranslations.push({
                language,
                scope,
                phrase: fieldFormData[fieldCode] || '',
                translation: fieldData[fieldCode],
                type: SIMPLE_VALUE_TYPE,
                code: getTranslationSectionCode(formId, sectionId, `fields_${fieldId}_${fieldCode}`),
              });
            });
          });
        } else {
          const phrase = section?.[field] || '';
          const translation = {
            language,
            scope,
            phrase,
            translation: sectionData[field],
            code: getTranslationSectionCode(formId, sectionId, field),
          };
          if (DESCRIPTION_FIELDS.includes(field)) {
            descriptionTranslations.push(translation);
          } else {
            translation.type = SIMPLE_VALUE_TYPE;
            simpleTranslations.push(translation);
          }
        }
      });
    });
  });
  return {
    simple: simpleTranslations,
    description: descriptionTranslations,
  };
};

export const parseTranslationsFromBackend = (simpleTranslations, descriptionTranslations) => {
  const result = {};
  [...simpleTranslations, ...descriptionTranslations].forEach(({ code, translation, language }) => {
    // eslint-disable-next-line no-unused-vars
    const [formId, field, sectionId, sectionField, formFieldId, formFieldValueCode] = code.replace('subscription-management_form_', '').split('_');
    const translationObject = {
      [language]: {},
    };
    if (field === 'configuration') {
      if (sectionField === 'fields') {
        translationObject[language].configuration = {
          [sectionId]: {
            fields: {
              [formFieldId]: {
                [formFieldValueCode]: translation,
              },
            },
          },
        };
      } else {
        translationObject[language].configuration = {
          [sectionId]: {
            [sectionField]: translation,
          },
        };
      }
    } else {
      translationObject[language][field] = translation;
    }
    mergeDeep(result, translationObject);
  });
  return result;
};

export const fetchTranslations = async (formId) => {
  const scope = getTranslationScope(formId);
  try {
    const getSimpleTranslations = restApiRequest(
      TRANSLATOR_SERVICE,
      '/translations',
      'GET',
      {
        params: { scope },
      },
      [],
    );
    const getDescriptionTranslations = restApiRequest(
      TRANSLATOR_SERVICE,
      '/cms-translations',
      'GET',
      {
        params: { scope },
      },
      [],
    );
    const [simple, description] = await Promise.all([getSimpleTranslations, getDescriptionTranslations]);
    return parseTranslationsFromBackend(simple, description);
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się pobrać tłumaczeń'), 'error');
    return {};
  }
};

export const saveTranslations = async (data, formId, formData) => {
  try {
    const { simple, description } = parseTranslationsToBackend(data, formId, formData);
    const saveSimpleTranslations = restApiRequest(
      TRANSLATOR_SERVICE,
      '/mass-save',
      'POST',
      {
        body: {
          data: simple,
        },
      },

    );
    const saveDescriptionTranslations = restApiRequest(
      TRANSLATOR_SERVICE,
      '/cms/mass-save',
      'POST',
      {
        body: {
          data: description,
        },
      },
    );
    await Promise.all([saveSimpleTranslations, saveDescriptionTranslations]);
    return parseTranslationsFromBackend(simple, description);
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się pobrać tłumaczeń'), 'error');
    return {};
  }
};

const getTranslationScope = (formId) => `subscription-management_form_${formId}`;
const getTranslationFieldCode = (formId, field) => `subscription-management_form_${formId}_${field}`;
const getTranslationSectionCode = (formId, sectionId, field) => `subscription-management_form_${formId}_configuration_${sectionId}_${field}`;
const DESCRIPTION_FIELDS = ['content'];
