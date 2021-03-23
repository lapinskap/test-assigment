import { renderHook } from '@testing-library/react-hooks';
import useRentableGroupSelectionWindows, { IRI_PREFIX } from './useRentableGroupSelectionWindows';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useRentableGroupSelectionWindows', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useRentableGroupSelectionWindows(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useRentableGroupSelectionWindows());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'windowType' in result.current[0]).toBeTruthy();
  });

  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useRentableGroupSelectionWindows(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useRentableGroupSelectionWindows(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
