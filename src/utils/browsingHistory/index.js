import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getSession } from '../RoleBasedSecurity/Session';

export const TYPE_LISTING = 'listing';
export const TYPE_EDIT = 'edit';

const getLocalStorageKey = () => {
  const role = getSession().getUserInfo().getRole();
  return `omb_browsing_history_${role}`;
};

export const getBrowsingHistory = () => {
  try {
    const result = JSON.parse(window.localStorage.getItem(getLocalStorageKey()));
    if (Array.isArray(result)) {
      return result;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
};

const setBrowsingHistory = (data) => window.localStorage.setItem(getLocalStorageKey(), JSON.stringify(data));

export const useAddToHistory = (title, type, canAddToHistory) => {
  const path = useLocation().pathname;
  useEffect(() => {
    if (!canAddToHistory) {
      return;
    }
    const history = getBrowsingHistory();
    let historyItem = history.find((item) => item.path === path);
    if (!historyItem) {
      historyItem = {};
      history.push(historyItem);
    }

    historyItem.path = path;
    historyItem.title = title;
    historyItem.type = type;
    historyItem.time = Date.now();

    setBrowsingHistory(history.sort((a, b) => b.time - a.time).slice(0, 20));
  }, [title, type, path, canAddToHistory]);
};
