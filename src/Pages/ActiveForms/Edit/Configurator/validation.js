import { CONTENT_SECTION_TYPE, FORM_SECTION_TYPE, HEADER_SECTION_TYPE } from '../utils/consts';
import __ from '../../../../utils/Translations';

export default function validate(data) {
  const errors = {};
  data.forEach(({ type, id, ...sectionData }) => {
    let sectionErrors = null;
    if (type === HEADER_SECTION_TYPE) {
      sectionErrors = validateHeader(sectionData);
    } else if (type === FORM_SECTION_TYPE) {
      sectionErrors = validateForm(sectionData);
    } else if (type === CONTENT_SECTION_TYPE) {
      sectionErrors = validateContent(sectionData);
    }
    if (sectionErrors) {
      errors[id] = sectionErrors;
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
}

const validateHeader = ({ value }) => {
  if (!value) {
    return { value: __('To pole jest wymagane') };
  }
  return null;
};

const validateContent = ({ name, content }) => {
  const result = {};
  if (!name) {
    result.name = __('To pole jest wymagane');
  }
  if (!content) {
    result.content = __('To pole jest wymagane');
  }
  return Object.keys(result).length > 0 ? result : null;
};

const validateForm = ({ fields }) => {
  const result = {};
  if (Array.isArray(fields) && fields.length > 0) {
    fields.forEach(({ id, label }) => {
      if (!label) {
        if (!result.field) {
          result.field = {};
        }
        result.field[id] = {
          label: __('To pole jest wymagane'),
        };
      }
    });
  } else {
    result.fields = __('Sekcja nie może być pusta');
  }
  return Object.keys(result).length > 0 ? result : null;
};

export const getErrorForField = (errors, sectionId, field) => {
  if (!errors) {
    return null;
  }
  return errors && errors[sectionId] && errors[sectionId][field] ? errors[sectionId][field] : null;
};
export const getErrorForFormField = (errors, sectionId, fieldId, field) => {
  if (!errors) {
    return null;
  }
  return errors && errors[sectionId] && errors[sectionId].field && errors[sectionId].field[fieldId] && errors[sectionId].field[fieldId][field]
    ? errors[sectionId].field[fieldId][field] : null;
};
