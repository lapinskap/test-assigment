import {
  clearSessionData,
  deleteSession, getSession, getUserInfo, initSession, USER_INFO_STORAGE_KEY,
} from './Session';
import { MOCK_ADMIN_ACCESS_TOKEN } from './tmpAuthorization';

describe('Session', () => {
  afterEach(() => {
    deleteSession();
  });

  it('init session correctly and work as singleton', async () => {
    expect(getSession).toThrowError('Session has not been initialized');
    const session = await initSession();
    expect(typeof session === 'object').toBe(true);
    const sessionSingleton = getSession();
    expect(session === sessionSingleton).toBeTruthy();
  });
  it('correctly set data on login action', async () => {
    const session = await initSession();
    const accessToken = 'qwert';
    const refreshToken = 'asdfgh';
    const expiresIn = 3600;
    const date = Date.now();
    await session.login(accessToken, refreshToken, date, expiresIn);

    expect(session.getAccessToken()).toBe(accessToken);
    expect(session.getRefreshToken()).toBe(refreshToken);
    expect(session.getAccessTokenTtl()).toBeGreaterThan(Date.now());
  });
  it('refresh token correctly', async () => {
    const session = await initSession();
    await session.refreshToken();
    // Values taken from mocks
    expect(session.getRefreshToken()).toBe(MOCK_ADMIN_ACCESS_TOKEN);
    expect(session.getAccessToken()).toBe(MOCK_ADMIN_ACCESS_TOKEN);
  });

  it('delete session', async () => {
    await initSession();
    deleteSession();
    expect(getSession).toThrowError('Session has not been initialized');
  });
  it('check is token is valid', async () => {
    await initSession();
    const session = await initSession();
    const accessToken = 'qwert';
    const refreshToken = 'asdfgh';
    const date = Date.now();
    await session.login(accessToken, refreshToken, date, -50);
    expect(session.isAccessTokenValid()).toBe(false);
    await session.login(accessToken, refreshToken, date, 50);
    expect(session.isAccessTokenValid()).toBe(true);
  });
  it('return valid access token', async () => {
    await initSession();
    const session = await initSession();
    const accessToken = 'qwert';
    const refreshToken = 'asdfgh';
    const date = Date.now();
    await session.login(accessToken, refreshToken, date, 50);
    expect(await session.getValidAccessToken()).toBe(accessToken);
    await session.login(accessToken, refreshToken, date, -50);
    expect(await session.getValidAccessToken()).toBe(MOCK_ADMIN_ACCESS_TOKEN);
    await session.login(accessToken, '', date, -50);
    expect(await session.getValidAccessToken()).toBe('');
  });
  test('getUserInfo method', async () => {
    clearSessionData();
    let userInfo = await getUserInfo();
    expect(userInfo.role).toBe('omb');
    clearSessionData();
    sessionStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify({ id: '54d539d4-d178-11ea-87d0-0242ac130003' }));
    userInfo = await getUserInfo();
    expect(userInfo.role).toBe('omb');
    clearSessionData();
  });
  test('getUserInfo method throws error when ids does not match', async () => {
    clearSessionData();
    sessionStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify({ id: 'wrong-id' }));
    await expect(getUserInfo()).rejects.toThrow('User id has changed');
    clearSessionData();
  });
});
