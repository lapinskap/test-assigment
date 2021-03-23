import { renderHook } from '@testing-library/react-hooks';
import usePointsBanks from './usePointsBanks';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useEmployees', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => usePointsBanks(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => usePointsBanks());
    await waitToLoadMocks();
    expect('name' in result.current[0] && 'id' in result.current[0]).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => usePointsBanks(false, 'randomField', 'randomValue', 'secondRandomField', 'secondRandomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
