import { renderHook } from '@testing-library/react-hooks';
import useEmployees, { IRI_PREFIX } from './useEmployees';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useEmployees', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useEmployees(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useEmployees());
    await waitToLoadMocks();
    expect('firstName' in result.current[0] && 'lastName' in result.current[0] && 'id' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useEmployees(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useEmployees(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
