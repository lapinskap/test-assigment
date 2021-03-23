import { useState, useEffect } from 'react';
import { DICTIONARY_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';

export default function useDictionary(code, asOptions = true) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!code) {
      return;
    }
    restApiRequest(
      DICTIONARY_SERVICE,
      '/dictionaries',
      'GET',
      {
        params: {
          code,
          itemsPerPage: 10000,
        },
      },
      dictionaryMockData,
    )
      .then((resData) => {
        const dictionary = resData.find((el) => el.code === code || el.mock);
        let result = [];
        if (dictionary && dictionary.itemsJson) {
          result = dictionary.itemsJson.sort((a, b) => a.position - b.position).map(({ key, value }) => {
            if (asOptions) {
              return { value: key, label: value };
            }
            return { key, value };
          });
        }
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać słowników'), 'error'));
  }, [code, asOptions]);

  return data;
}
export const dictionaryMockData = [{
  mock: true,
  itemsJson: [
    {
      key: 'kluczZeSłownika1',
      value: 'Wartość ze słownika 1',
      position: 1,
    },
    {
      key: 'kluczZeSłownika2',
      value: 'Wartość ze słownika 2',
      position: 2,
    },
    {
      key: 'kluczZeSłownika3',
      value: 'Wartość ze słownika 3',
      position: 3,
    },
  ],
}];
