export const BLOCKED_REQUESTS_STORAGE_KEY = 'blocked_requests';

const saveBlockedRequests = (requests) => {
  sessionStorage.setItem(BLOCKED_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
};

const getBlockedRequests = () => {
  let result;
  try {
    result = JSON.parse(sessionStorage.getItem(BLOCKED_REQUESTS_STORAGE_KEY)) || [];
  } catch (e) {
    result = [];
    sessionStorage.removeItem(BLOCKED_REQUESTS_STORAGE_KEY);
  }
  return result;
};

export const addBlockedRequest = (path) => {
  const blockedRequest = [...getBlockedRequests()];
  if (!blockedRequest.includes(path)) {
    blockedRequest.push(path);
    saveBlockedRequests(blockedRequest);
  }
};

export const removeBlockedRequest = (path) => {
  saveBlockedRequests(getBlockedRequests().filter((el) => el !== path));
};

export const isBlockedRequest = (path) => getBlockedRequests().includes(path);
