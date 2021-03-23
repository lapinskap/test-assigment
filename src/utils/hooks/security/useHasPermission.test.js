import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import useHasPermission from './useHasPermission';
import RbsContext from '../../RoleBasedSecurity/RbsContext';
import { godPermission } from '../../RoleBasedSecurity/permissions';
import UserInfo from '../../RoleBasedSecurity/UserInfo';

// eslint-disable-next-line import/prefer-default-export
export const getPermissionsWrapper = (permissions) => ({ children }) => (
  <RbsContext.Provider value={{
    userInfo: new UserInfo({ permissions }),
  }}
  >
    {children}
  </RbsContext.Provider>
);

describe('useHasPermission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('return true on god mode', () => {
    const { result } = renderHook(
      () => useHasPermission('random_scope'),
      { wrapper: getPermissionsWrapper([godPermission]) },
    );
    expect(result.current).toBe(true);
  });

  it('return true on correct permission', () => {
    const { result } = renderHook(
      () => useHasPermission('test_2'),
      { wrapper: getPermissionsWrapper(['test_1', 'test_2']) },
    );
    expect(result.current).toBe(true);
  });

  it('return false on missiong permission', () => {
    const { result } = renderHook(
      () => useHasPermission('test_3'),
      { wrapper: getPermissionsWrapper(['test_1', 'test_2']) },
    ); expect(result.current).toBe(false);
  });
});
