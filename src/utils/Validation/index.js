/* eslint no-unused-vars: 0 */
/* eslint no-eval: 0 */
import __ from '../Translations';

export default function validate(value, validators) {
  if (validators && validators.length) {
    let message;
    for (let i = 0; i < validators.length; i += 1) {
      const rule = validators[i];
      if (typeof rule === 'object') {
        const { method, args } = rule;
        message = eval(`${method}`)(value, ...args);
      } else {
        message = eval(`${rule}`)(value);
      }
      if (message) {
        return message;
      }
    }
  }
  return null;
}
// eval method fires functions below, `validators` contains function name
// example: validatiors = ['required', { method: 'minLength', args: [3] }];
const required = (value) => {
  let isValid = true;
  if ((Array.isArray(value) || value instanceof FileList) && value.length === 0) {
    isValid = false;
  } else if (!value) {
    isValid = false;
  }
  return isValid ? null : __('To pole jest wymagane');
};

const requiredCheckbox = (value) => {
  let isValid = true;
  if (!Array.isArray(value) || value.length === 0) {
    isValid = false;
  }
  return isValid ? null : __('Należy wybrać przynajmniej jedną opcję');
};

const minLength = (value, minLen) => (value && value.length < minLen ? __('Minimalna ilość znaków dla tego pola to {0}', [minLen]) : null);

const maxLength = (value, maxLen) => (value && value.length > maxLen ? __('Maksymalna ilość znaków dla tego pola to {0}', [maxLen]) : null);

const greaterEqualThan = (value, minValue) => (value && value < minValue ? __('Wartość pola musi być większa lub równa {0}', [minValue]) : null);

const greaterThan = (value, minValue) => (value && value <= minValue ? __('Wartość pola musi być większa od {0}', [minValue]) : null);

const lessEqualThan = (value, maxValue) => (value && value > maxValue ? __('Wartość pola musi być mniejsza od {0}', [maxValue]) : null);

const greaterEqualThanDate = (value, minValueArg) => {
  const minValue = minValueArg instanceof Date ? minValueArg : new Date(minValueArg);
  return (value && value < minValue
    ? __(
      'Data nie może być wcześniejsza niż {0}',
      [minValue.toLocaleDateString('pl-PL')],
    ) : null);
};
export const allowedExtensions = (files = [], extensions = []) => {
  let valid = true;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (file && file.name) {
      const extension = file.name.split('.').pop();
      if (!extensions.includes(extension)) {
        valid = false;
        break;
      }
    }
  }
  return valid ? null : __('Dozwolone rozszerzenia pliku: {0}', [extensions.join(', ')]);
};

const lessEqualThanDate = (value, maxValueArg) => {
  const maxValue = maxValueArg instanceof Date ? maxValueArg : new Date(maxValueArg);
  return (value && value > maxValue
    ? __(
      'Data nie może być późniejsza niż {0}',
      [maxValue.toLocaleDateString('pl-PL')],
    ) : null);
};

const rangeRequiredBoth = (fieldValue) => {
  const value = fieldValue || {};
  if (value && value.from && value.to) {
    return null;
  }
  return JSON.stringify({
    from: value.from ? null : __('To pole jest wymagane'),
    to: value.to ? null : __('To pole jest wymagane'),
  });
};

const datetimeRequired = (fieldValue) => {
  const value = fieldValue || {};
  if (value && value.date && value.time) {
    return null;
  }
  return JSON.stringify({
    date: value.date ? null : __('To pole jest wymagane'),
    time: value.time ? null : __('To pole jest wymagane'),
  });
};

const rangeRequiredFrom = (fieldValue) => {
  const value = fieldValue || {};
  if (value && value.from) {
    return null;
  }

  return JSON.stringify({
    from: __('To pole jest wymagane'),
    to: null,
  });
};

const ipv4 = (fieldValue) => {
  if (!fieldValue) {
    return null;
  }
  // eslint-disable-next-line max-len
  const ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return fieldValue.match(ipFormat) ? null : __('Nieprawidłowy adres IPv4');
};
const url = (fieldValue) => {
  if (!fieldValue) {
    return null;
  }
  // eslint-disable-next-line max-len
  const urlFormat = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return fieldValue.match(urlFormat) ? null : __('Niepoprawny adres URL. Wymagany format http(s)://(www.)domena.com/(ścieżka)(?parametry)');
};

const rangeRequiredTo = (fieldValue) => {
  const value = fieldValue || {};
  if (value && value.to) {
    return null;
  }
  return JSON.stringify({
    from: null,
    to: __('To pole jest wymagane'),
  });
};

const mustBeEqual = (value, referenceValue, errorMessage) => (value === referenceValue ? null : __(errorMessage));

const phone = (value) => (
  !value
  || value.match(/^(\+?)?[\d -]{9,64}$/) ? null : __('Nieprawidłowy format numeru telefonu')
);

const nip = (value) => (!value || value.match(/^\d{10}$/) ? null : __('Nieprawidłowy format numeru NIP'));

const krs = (value) => (!value || value.match(/^\d{10}$/) ? null : __('Nieprawidłowy format numeru KRS'));

const fax = (value) => (!value || value.match(/^\+?[0-9]+$/) ? null : __('Nieprawidłowy format numeru fax'));

const email = (value) => (!value || value.match(/^([a-z0-9_.-]+@[a-z0-9_.-]+\.[a-z]{2,4})?$/) ? null : __('Nieprawidłowy format adresu e-mail'));

const regon = (value) => (!value || value.match(/^(\d{7}|\d{9})$/) ? null : __('Nieprawidłowy format numeru REGON'));

const postCode = (value) => (!value || value.match(/^([0-9]{2})(-[0-9]{3})?$/) ? null : __('Nieprawidłowy kod pocztowy'));

const numberList = (value) => (!value || value.match(/^([0-9]+(\.[0-9]+)?;?)+$/) ? null : __('Nieprawidłowy format listy'));

const password = (value) => {
  const result = null;
  if (!value) {
    return null;
  }
  if (!value.match(/(?=^.{8,}$)/)) {
    return __('Hasło musi składać się przynajmniej z 8 znaków');
  }
  if (!value.match(/(?=.*\d)/)) {
    return __('Hasło musi mieć przynajmniej jedną cyfrę');
  }
  if (!value.match(/(?=.*[^a-zA-Z\dĄŹŻŁŚĆÓążźłśćó]+)/)) {
    return __('Hasło musi zawierać przynajmniej jeden znak specialny');
  }
  if (!value.match(/(?=.*[A-ZĄŹŻŁŚĆÓ])/)) {
    return __('Hasło musi zawierać przynajmniej jedną wielką literę');
  }
  if (!value.match(/(?=.*[a-zążźłśćó])/)) {
    return __('Hasło musi zawierać przynajmniej jedną małą literę');
  }

  return null;
};

const customValidation = (value, method) => (method ? method(value) : null);
