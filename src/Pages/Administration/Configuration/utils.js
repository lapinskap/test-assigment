import isJson from '../../../utils/jsHelpers/isJson';
import isObject from '../../../utils/jsHelpers/isObject';

export const parseDataToBackend = (data) => {
  const bodyData = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (isObject(value)) {
      bodyData[key] = JSON.stringify(value);
    } else {
      bodyData[key] = value;
    }
  });
  return bodyData;
};

export const parseDataFromBackend = (data, sectionId) => {
  const result = {};
  data.forEach(({ path, value }) => {
    if (!sectionId || path.split('/')[0] === sectionId) {
      if (isJson(value)) {
        result[path] = JSON.parse(value);
      } else {
        result[path] = value;
      }
    }
  });
  return result;
};

export const parseDefaultDataFromBackend = (data, sectionId) => {
  const result = {};
  Object.keys(data).forEach((path) => {
    if (!sectionId || path.split('/')[0] === sectionId) {
      let value = data[path];
      if (isJson(value) && value !== null) {
        value = JSON.parse(value);
      }
      if (value !== null) {
        result[path] = value;
      }
    }
  });
  return result;
};
