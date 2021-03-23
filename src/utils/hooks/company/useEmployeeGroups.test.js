import { renderHook } from '@testing-library/react-hooks';
import useEmployeeGroups, { IRI_PREFIX } from './useEmployeeGroups';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useEmployeeGroups', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useEmployeeGroups(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useEmployeeGroups(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useEmployeeGroups(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
