import { renderHook } from '@testing-library/react-hooks';
import useRentableGroups, { IRI_PREFIX } from './useRentableGroups';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useRentableGroups', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useRentableGroups(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useRentableGroups());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'frontendName' in result.current[0]).toBeTruthy();
  });

  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useRentableGroups(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useRentableGroups(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
