import { renderHook } from '@testing-library/react-hooks';
import useConfigValue from './useConfigValue';
import { waitToLoadMocks } from '../../../tests/helpers';
import { clearSessionData, initSession } from '../../RoleBasedSecurity/Session';
import { setIsMockView } from '../../Api';

describe('useConfigValue', () => {
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    jest.clearAllMocks();
    clearSessionData();
  });

  it('get request for default scope', async () => {
    const fetchSpy = jest.fn((urlPath) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(urlPath),
    }));

    const path = 'config-path';

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    global.fetch = fetchSpy;
    const { result } = renderHook(() => useConfigValue(path));
    await waitToLoadMocks();
    expect(result.current).toBe(`/api/configuration/v1/rest/get-config-value?path=${path}`);
  });

  it('get request for company scope', async () => {
    const fetchSpy = jest.fn((urlPath) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(urlPath),
    }));

    const path = 'config-path';
    const companyId = '1';

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    global.fetch = fetchSpy;
    const { result } = renderHook(() => useConfigValue(path, companyId));
    await waitToLoadMocks();
    expect(result.current).toBe(`/api/configuration/v1/rest/get-config-value?path=${path}&companyId=${companyId}`);
  });

  it('get request for employee group scope', async () => {
    const fetchSpy = jest.fn((urlPath) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(urlPath),
    }));

    const path = 'config-path';
    const companyId = '1';
    const employeeGroupId = '2';

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    global.fetch = fetchSpy;
    const { result } = renderHook(() => useConfigValue(path, companyId, employeeGroupId));
    await waitToLoadMocks();
    expect(result.current)
      .toBe(`/api/configuration/v1/rest/get-config-value?path=${path}&companyId=${companyId}&employeeGroupId=${employeeGroupId}`);
  });

  it('return null on reject request', async () => {
    const fetchSpy = jest.fn((urlPath) => Promise.reject(Error('same error')));

    const path = 'config-path';
    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    global.fetch = fetchSpy;
    const { result } = renderHook(() => useConfigValue(path));
    await waitToLoadMocks();
    expect(result.current).toBe(null);
  });
});
