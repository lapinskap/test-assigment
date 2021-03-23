import { useState, useEffect } from 'react';
import { DICTIONARY_SERVICE, restApiRequest } from '../../Api';
import { dynamicNotification } from '../../Notifications';
import __ from '../../Translations';
import { dictionaryMockData } from './useDictionary';

export default function useDictionariesMap(codes, asOptions = true) {
  const [data, setData] = useState(new Map());
  useEffect(() => {
    if (!codes || !codes.length) {
      return;
    }
    restApiRequest(
      DICTIONARY_SERVICE,
      '/dictionaries',
      'GET',
      {
        params: {
          code: codes,
          itemsPerPage: 10000,
        },
      },
      dictionaryMockData,
    )
      .then((resData) => {
        const result = new Map();
        codes.forEach((code) => {
          const dictionary = resData.find((el) => el.code === code || el.mock);
          let dictionaryItems = [];
          if (dictionary && dictionary.itemsJson) {
            dictionaryItems = dictionary.itemsJson.sort((a, b) => a.position - b.position).map(({ key, value }) => {
              if (asOptions) {
                return { value: key, label: value };
              }
              return { key, value };
            });
          }
          result.set(code, dictionaryItems);
        });
        setData(result);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać słowników'), 'error'));
  }, [codes, asOptions]);

  return data;
}
