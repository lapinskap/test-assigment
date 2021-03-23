import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function useQueryToState() {
  const history = useHistory();
  const [initialState] = useState(() => getInitialState(history));
  const changeQuery = (params) => {
    const readyParams = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (typeof value === 'object') {
        const { from, to } = value;
        if (from) {
          readyParams[`${key}[after]`] = from.toISOString();
        }
        if (to) {
          readyParams[`${key}[before]`] = to.toISOString();
        }
      } else {
        readyParams[key] = value;
      }
    });
    const searchParams = new URLSearchParams(readyParams);
    const queryString = `?${searchParams.toString()}`;
    history.push({
      hash: history.location.hash,
      search: queryString,
    });
  };

  return [initialState, changeQuery];
}

export function paramsToObject(entries) {
  const result = {};
  [...entries].forEach((entry) => {
    const [key, value] = entry;
    if (key.endsWith(['[after]'])) {
      const realKey = key.replace('[after]', '');
      if (!result[realKey]) {
        result[realKey] = {};
      }
      result[realKey].from = new Date(value);
    } else if (key.endsWith('[before]')) {
      const realKey = key.replace('[before]', '');
      if (!result[realKey]) {
        result[realKey] = {};
      }
      result[realKey].to = new Date(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

const getInitialState = (history) => {
  const urlParams = new URLSearchParams(history.location.search);
  const entries = urlParams.entries();
  return paramsToObject(entries);
};
