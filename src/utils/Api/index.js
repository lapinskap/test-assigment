import AppConfig from '../../config/appConfig';
import ApiResponseError from './ApiResponseError';
// eslint-disable-next-line import/no-cycle
import { getSession } from '../RoleBasedSecurity/Session';
import { isTestMode } from '../../config/env';
import ApiForbiddenError from './ApiForbiddenError';
import { getLanguage } from '../Languages/LanguageContext';
import { addBlockedRequest, isBlockedRequest, removeBlockedRequest } from '../RoleBasedSecurity/blockedRequests';
// eslint-disable-next-line import/no-cycle
import __ from '../Translations';

export const COMPANY_MANAGEMENT_SERVICE = 'company-management';
export const EMPLOYEE_MANAGEMENT_SERVICE = 'employee-management';
export const TRANSLATOR_SERVICE = 'translator';
export const CONFIGURATION_SERVICE = 'configuration';
export const OPERATOR_MANAGEMENT_SERVICE = 'operator-management';
export const MAGENTO_HELPER_SERVICE = 'magento-helper';
export const MAGENTO_ADMIN_SERVICE = 'magento-admin';
export const AGREEMENT_SERVICE = 'agreement';
export const NOTIFICATION_SERVICE = 'notification';
export const CMS_SERVICE = 'cms';
export const SSO_SERVICE = 'sso';
export const DICTIONARY_SERVICE = 'dictionary';
export const CATALOG_MANAGEMENT_SERVICE = 'catalog-management';
export const SUBSCRIPTION_MANAGEMENT_SERVICE = 'subscription-management';
export const EMPLOYEE_GROUP_PRODUCT_SERVICE = 'employee-group-product';
export const TOURISM_SERVICE = 'tourism';
export const MASTERDATA_SERVICE = 'masterdata';
export const REPORT_SERVICE = 'report';

export const getServiceHost = (service) => AppConfig.get(`endpoints.${service}`) || '';

export const isMockView = () => Boolean(window.localStorage.getItem('use_mocks') || isTestMode());
export const setIsMockView = (value) => {
  if (value) {
    window.localStorage.setItem('use_mocks', '1');
  } else {
    window.localStorage.removeItem('use_mocks');
  }
};

export const getQueryString = (parameters, joinArray) => {
  const params = { ...parameters };
  const result = `?${Object.keys(params).map((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      if (joinArray) {
        return `${key}=${value.join(',')}`;
      }
      return value.map((el) => `${key}[]=${el}`).join('&');
    }
    return `${key}=${value}`;
  }).join('&')}`;

  return encodeURI(result);
};

export const restApiRequest = async (service, path, method, {
  headers = {}, params = null, body = null, joinArray = false, skipToken = false, returnNull = false,
}, mockData) => {
  if (isMockView()) {
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 100));
  }

  const baseHeaders = {
    accept: 'application/json',
  };
  const session = getSession();
  if (!skipToken) {
    baseHeaders.authorization = `Bearer ${await session.getValidAccessToken()}`;
  }

  switch (method) {
    case 'PUT':
      baseHeaders['content-type'] = 'application/json';
      break;
    case 'POST':
      baseHeaders['content-type'] = 'application/json';
      break;
    case 'DELETE':
      baseHeaders['content-type'] = 'application/json';
      break;
    case 'PATCH':
      baseHeaders['content-type'] = 'application/merge-patch+json';
      break;
    default:
            // DO Nothing
  }

  baseHeaders['content-language'] = getLanguage().toLowerCase();

  const queryString = params ? getQueryString(params, joinArray) : '';
  const urlPath = getServiceHost(service) + path + queryString;
  const response = await fetch(urlPath, {
    method,
    headers: {
      ...baseHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && !isBlockedRequest(path)) {
      addBlockedRequest(path);
      if (session.getRefreshToken()) {
        await new Promise(() => session.refreshToken());
        return null;
      }
      // TODO redirect to login page
      return null;
    }
    if (response.status === 403 || response.status === 404 || response.status === 401) {
      let errorMessage = 'Nie masz dostępu do tego zasobu';
      try {
        const { detail } = await response.json();
        if (detail) {
          errorMessage = detail;
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
      throw new ApiForbiddenError(errorMessage);
    }
    const { status, url } = response;
    let error;
    let message;
    try {
      const { title, detail } = await response.json();
      error = title;
      message = detail;
    } catch (e) {
      error = null;
      message = __('Niepoprawna odpowiedź z serwera');
    }
    throw new ApiResponseError(status, url, error, message);
  }
  removeBlockedRequest(path);
  if (returnNull) {
    return null;
  }

  return response.json();
};

export const downloadFile = async (service, path, fileName) => {
  const session = getSession();
  const response = await fetch(
    `${getServiceHost(service)}${path}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${await session.getValidAccessToken()}`,
      },
    },
  );
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

export const uploadFile = async (service, path, file, headers = {}, allowedExtensions = null, method = 'POST') => {
  if (allowedExtensions) {
    const fileExtension = file.name.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(__('Rozszerzenie pliku {0} nie znajduje się na liście dozwolonych: {1}.', [fileExtension, allowedExtensions.join(', ')]));
    }
  }
  const session = getSession();
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${getServiceHost(service)}${path}`,
    {
      method,
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${await session.getValidAccessToken()}`,
        ...headers,
      },
    },
  );
  if (!response.ok) {
    const { title, detail } = await response.json();
    const { status, url } = response;
    throw new ApiResponseError(status, url, title, detail);
  }
  return response.json();
};
