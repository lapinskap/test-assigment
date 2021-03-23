// eslint-disable-next-line import/no-cycle
import { isMockView, restApiRequest, TRANSLATOR_SERVICE } from '../Api';
import { isTestMode } from '../../config/env';
import { defaultLanguage, INTERFACE_CODE } from './translationUtils';
import { getLanguage } from '../Languages/LanguageContext';

window.translations = window.translations || {};

export const isDefaultLanguage = () => getLanguage() === defaultLanguage;
export const getTranslation = (phrase) => window.translations[phrase];
export const setTranslations = (phrases) => {
  window.translations = { ...window.translations, ...phrases };
};

const useTranslation = (!isDefaultLanguage() && !isMockView()) || isTestMode();

export const fetchMissingTranslations = async (phrases) => {
  const language = getLanguage();
  const response = await restApiRequest(
    TRANSLATOR_SERVICE,
    '/get-by-phrase',
    'GET',
    {
      params: {
        language,
        scope: INTERFACE_CODE,
        value: phrases,
      },
    },
    '{"firma": "company"}',
  );
  const newTranslations = JSON.parse(response);
  setTranslations(newTranslations);
};

// eslint-disable-next-line no-underscore-dangle
const __ = (phrase, args = []) => {
  let result = phrase;
  if (useTranslation && !isDefaultLanguage()) {
    const translation = getTranslation(phrase);
    if (translation === undefined) {
      fetchMissingTranslations([phrase]);
    }
    result = translation || result;
  }

  if (args.length) {
    const elementsToReplace = result.matchAll(/{(.*?)}/g);
    [...elementsToReplace].forEach(([toReplace, index]) => {
      result = result.replace(toReplace, args[index]);
    });
  }

  return result;
};

export default __;
