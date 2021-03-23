// eslint-disable-next-line import/prefer-default-export
export const defaultValidation = { method: 'maxLength', args: [255] };

export const getActualValidation = (validation, type) => {
  switch (type) {
    case 'number':
    case 'text':
    case 'textarea':
      return validation ? [...validation, defaultValidation] : [defaultValidation];
    default:
      return validation;
  }
};
