import React, {
  useContext, useEffect, useState,
} from 'react';
import { defaultLanguage } from '../Translations/translationUtils';

const LanguageContext = React.createContext({
  languagesConfig: [],
  defaultLanguage: '',
});

export const LANGUAGE_STORAGE_KEY = 'user_language';

export const getLanguage = () => {
  const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (value) {
    return value;
  }
  return defaultLanguage;
};
export const setLanguage = (lang) => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
};
export const removeLanguage = () => {
  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
};

export const useLanguages = (withDefault = false, asOptions = false) => {
  const [result, setResult] = useState([]);
  const { languagesConfig } = useContext(LanguageContext);
  useEffect(() => {
    if (withDefault) {
      setResult(languagesConfig);
    } else {
      setResult(languagesConfig.filter(({ isDefault }) => !isDefault));
    }
  }, [withDefault, languagesConfig]);
  if (!asOptions) {
    return result;
  }
  return result.map(({ code, label }) => ({ value: code, label }));
};

export const useDefaultLanguage = () => {
  const { defaultLanguage: result } = useContext(LanguageContext);

  return result;
};

export default LanguageContext;
