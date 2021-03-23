import { renderHook } from '@testing-library/react-hooks';
import useRolePermissions from './useRolePermissions';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useRolePermissions', () => {
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    jest.clearAllMocks();
  });

  it('returns empty array when wrong role', async () => {
    const { result } = renderHook(() => useRolePermissions('wrong_role'));
    await waitToLoadMocks();
    expect(result.current).toMatchObject([]);
  });
  it('returns data array for ahr', async () => {
    const { result } = renderHook(() => useRolePermissions('ahr'));
    await waitToLoadMocks();
    expect('scope' in result.current[0] && 'code' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns data array for omb', async () => {
    const { result } = renderHook(() => useRolePermissions('omb'));
    await waitToLoadMocks();
    expect('scope' in result.current[0] && 'code' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
});
