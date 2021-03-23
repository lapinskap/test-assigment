import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import pl from 'date-fns/locale/pl';
import en from 'date-fns/locale/en-US';
import uk from 'date-fns/locale/uk';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest, TRANSLATOR_SERVICE } from '../Api';
import { INTERFACE_CODE } from '../Translations/translationUtils';
import LanguageContext, { setLanguage, getLanguage } from './LanguageContext';
import DefaultFallback from '../../Layout/AppMain/DefaultFallback';
import RbsContext from '../RoleBasedSecurity/RbsContext';

export const mockLanguages = [
  {
    code: 'pl',
    label: 'polski',
    isDefault: true,
    shortLabel: 'pl',
  },
  {
    code: 'en',
    label: 'angielski',
    isDefault: false,
    shortLabel: 'en',
  },
  // {
  //   code: 'uk',
  //   label: 'ukraiński',
  //   isDefault: false,
  //   shortLabel: 'UK',
  // },
];

export const getLanguagesConfig = async () => {
  try {
    return await restApiRequest(
      TRANSLATOR_SERVICE,
      '/languages',
      'GET',
      {},
      mockLanguages,
    );
  } catch (e) {
    return [...mockLanguages];
  }
};
export const getCompanyLanguages = async (companyId) => {
  try {
    const response = await restApiRequest(
      COMPANY_MANAGEMENT_SERVICE,
      `/companies/${companyId}`,
      'GET',
      {},
      [],
    );
    return response?.availableLanguages || [];
  } catch (e) {
    return [];
  }
};

export const loadInterfaceTranslation = async (language) => {
  try {
    const response = await restApiRequest(
      TRANSLATOR_SERVICE,
      '/get-by-scope',
      'GET',
      {
        params: {
          language,
          value: [INTERFACE_CODE],
        },
      },
      '{}',
    );
    window.translations = JSON.parse(response);
  } catch (e) {
    console.error(e);
  }
};

const init = async (setTranslationsLoaded, setLanguagesConfig, setDefaultLanguage, userInfo) => {
  const promises = [getLanguagesConfig()];

  const [allSystemLanguages, companyLanguages = null] = await Promise.all(promises);
  const languageConfig = allSystemLanguages;

  const defaultLanguage = languageConfig.find(({ isDefault }) => isDefault);
  let language = getLanguage();

  if (!languageConfig.find(({ code }) => code === language)) {
    language = defaultLanguage.code;
    setLanguage(language);
  }
  registerGlobalLocale(language);
  if (defaultLanguage.code !== language) {
    await loadInterfaceTranslation(language);
  }
  setDefaultLanguage(defaultLanguage);

  setLanguagesConfig(languageConfig);
  setTranslationsLoaded(true);
};

export default function LanguageWrapper({ children }) {
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [languagesConfig, setLanguagesConfig] = useState({});
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const { userInfo } = useContext(RbsContext);

  useEffect(() => {
    init(setTranslationsLoaded, setLanguagesConfig, setDefaultLanguage, userInfo);
  }, [setTranslationsLoaded, setLanguagesConfig, setDefaultLanguage, userInfo]);

  if (!translationsLoaded) {
    return DefaultFallback;
  }
  return (
    <LanguageContext.Provider value={{
      languagesConfig,
      defaultLanguage,
    }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

const registerGlobalLocale = (languageCode) => {
  const locale = languageToLocaleMap[languageCode] || pl;
  registerLocale(languageCode, locale); // register it with the name you want
  setDefaultLocale(languageCode);
};

const languageToLocaleMap = {
  pl,
  en,
  uk,
};

LanguageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
