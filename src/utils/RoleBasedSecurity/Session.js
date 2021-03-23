// eslint-disable-next-line import/no-cycle
import { restApiRequest, setIsMockView, SSO_SERVICE } from '../Api';
import UserInfo from './UserInfo';
// eslint-disable-next-line import/no-cycle
import { MOCK_ADMIN_ACCESS_TOKEN } from './tmpAuthorization';
import { BLOCKED_REQUESTS_STORAGE_KEY } from './blockedRequests';

export const USER_INFO_STORAGE_KEY = 'user_info';
export const TMP_LOGIN_STORAGE_KEY = 'tmp_login';
export const SESSION_STORAGE_KEY = 'sso-token';

let singletonHandler = null;

class Session {
  constructor(
    accessToken = null,
    refreshToken = null,
    date = 0,
    expiresIn = 0,
  ) {
    this.setData(accessToken, refreshToken, date, expiresIn);
    this.getUserInfo = () => new UserInfo({});
  }

  updateSession(token, refreshToken, date, expiresIn) {
    const newSessionData = {
      token,
      refresh_token: refreshToken,
      date,
      expiresIn,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSessionData));
    this.setData(token, refreshToken, date, expiresIn);
  }

  setData(accessToken, refreshToken, date, expiresIn) {
    this.getRefreshToken = () => refreshToken;
    this.getAccessTokenTtl = () => date + (expiresIn * 1000);
    this.getAccessToken = () => accessToken;
  }

  isAccessTokenValid() {
    return (Date.now() < this.getAccessTokenTtl());
  }

  async getValidAccessToken() {
    try {
      const token = this.getAccessToken();
      if (token && this.isAccessTokenValid()) {
        return token;
      }
      if (this.getRefreshToken()) {
        this.refreshToken();
        return localStorage.getItem(TMP_LOGIN_STORAGE_KEY) ? this.getAccessToken() : new Promise(() => this.refreshToken());
      }
    } catch (e) {
      console.error(e);
    }
    return '';
  }

  login(accessToken, refreshToken, date, expiresIn) {
    this.updateSession(accessToken, refreshToken, date, expiresIn);
    localStorage.setItem(TMP_LOGIN_STORAGE_KEY, '1');
  }

  // eslint-disable-next-line class-methods-use-this
  refreshToken() {
    if (!localStorage.getItem(TMP_LOGIN_STORAGE_KEY)) {
      window.location = `/signin/oauth/client/refresh?refresh_token=${
        this.getRefreshToken()
      }&referer_url=${
        encodeURIComponent(`/${window.location.hash}`)
      }`;
    } else {
      this.login(MOCK_ADMIN_ACCESS_TOKEN, MOCK_ADMIN_ACCESS_TOKEN, Date.now(), 86400);
    }
  }
}

export function clearSessionData() {
  setIsMockView(false);
  localStorage.removeItem(TMP_LOGIN_STORAGE_KEY);
  localStorage.removeItem(USER_INFO_STORAGE_KEY);
  sessionStorage.removeItem(USER_INFO_STORAGE_KEY);
  sessionStorage.removeItem(BLOCKED_REQUESTS_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * @returns {Session}
 */
export function getSession() {
  if (!singletonHandler) {
    throw new Error('Session has not been initialized');
  }
  return singletonHandler;
}

// In localStorage we keep user info for tmp logins admin:admin omb:omb etc.
export async function getUserInfo() {
  let result;
  const devLoginUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
  if (devLoginUserInfo) {
    result = JSON.parse(devLoginUserInfo);
  } else {
    const savedUserInfoJson = sessionStorage.getItem(USER_INFO_STORAGE_KEY);
    let savedUserInfo = null;
    if (savedUserInfoJson) {
      savedUserInfo = JSON.parse(savedUserInfoJson);
    }
    const [{
      nickname: username, email, given_name: firstName, family_name: lastName, role, company_id: companyId, sub: id,
    }, { permissions, relations }] = await Promise.all([userInfoRequest(), permissionsRequest()]);
    const userData = {
      id,
      role,
      firstName,
      lastName,
      username,
      email,
      companyId,
      permissions,
      relations,
    };
    if (savedUserInfo && savedUserInfo.id !== id) {
      throw new Error('User id has changed');
    }
    sessionStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userData));
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    result = userData;
  }
  return result;
}

export const userInfoRequest = async () => restApiRequest(
  SSO_SERVICE,
  '/userinfo',
  'POST',
  {
    body: {},
  },
  {
    sub: '54d539d4-d178-11ea-87d0-0242ac130003',
    name: 'jantestowy',
    email: 'jan.testowy@example.com',
    role: 'omb',
    company_id: 'e1e3fbc1-0c0a-4032-9824-f688d167acc5',
    family_name: 'Testowy',
    given_name: 'Jan',
    nickname: 'jantestowy',
    preferred_username: 'jantestowy',
  },
);
export const permissionsRequest = async () => restApiRequest(
  SSO_SERVICE,
  '/me/permissions',
  'GET',
  {},
  {
    permissions: [
      'employee:employeeGroup:read',
      'employee:employeeLeave:read',
      'sso:ipAddressRestriction:write',
      'company:attachment:write',
      'company:application:write',
      'employee:ahrRole:read',
    ],
    relations: {
      company: [],
      employeeGroup: [],
      organizationUnit: [],
      rentableGroup: [],
      administeredCompanies: [],
      administeredEmployeeGroups: [],
      administeredOrganizationUnits: [],
    },
  },
);

export function deleteSession() {
  singletonHandler = null;
}

/**
 * @returns {Session}
 */
export async function initSession() {
  let session;
  if (!singletonHandler) {
    try {
      const storedValue = localStorage.getItem(SESSION_STORAGE_KEY);
      let accessToken;
      let refreshToken;
      let date;
      let expiresIn;
      if (storedValue) {
        const parsedValue = JSON.parse(storedValue);
        accessToken = parsedValue.token;
        refreshToken = parsedValue.refresh_token;
        date = parsedValue.date;
        expiresIn = parsedValue.expires_in;
      }
      session = new Session(accessToken, refreshToken, date, expiresIn);
      singletonHandler = session;
    } catch (e) {
      console.error(e);
      session = new Session();
      singletonHandler = session;
    }
  }
  return singletonHandler;
}
