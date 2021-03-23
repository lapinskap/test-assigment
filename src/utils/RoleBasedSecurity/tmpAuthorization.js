/* eslint import/no-cycle:0 */
import { setIsMockView } from '../Api';
import { USER_INFO_STORAGE_KEY } from './Session';
import { godPermission } from './permissions';

export const MOCK_ADMIN_ACCESS_TOKEN = 'asds';

const mockData = {
  token: MOCK_ADMIN_ACCESS_TOKEN,
  refresh_token: 'qwerty',
  date: Date.now(),
  expiresIn: 3600,
};

export default function tmpAuthorization(type) {
  let isMock = false;
  let companyId = 0;
  let role;
  let lastName;

  switch (type) {
    case 'omb':
      role = 'omb';
      lastName = 'mocks';
      isMock = true;
      break;
    case 'ahr':
      role = 'ahr';
      lastName = 'ahr mocks';
      isMock = true;
      companyId = 'a43275e4-eeb2-11ea-adc1-0242ac1200021';
      break;
    case 'admin':
      role = 'omb';
      lastName = 'admin';
      break;
    case 'adminahr':
      role = 'ahr';
      lastName = 'admin ahr';
      companyId = '18be83b7-79e7-4526-8752-0054419d8da9';
      break;
    default:
      return false;
  }
  setIsMockView(isMock);
  const userInfo = {
    id: 'dev',
    role,
    companyId,
    firstName: 'dev',
    lastName,
    email: 'test@example.com',
    permissions: [godPermission],
    relations: {
      company: companyId,
    },
    username: type,
  };

  window.localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));
  return {
    ...mockData,
    userInfo,
  };
}
