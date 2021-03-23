import { renderHook } from '@testing-library/react-hooks';
import useCompanies, { IRI_PREFIX } from './useCompanies';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useEmployeeGroups', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useCompanies(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useCompanies());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'fullName' in result.current[0]).toBeTruthy();
  });
  it('receives filter', async () => {
    const { result } = renderHook(() => useCompanies(false, 'name', '10clouds'));
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'fullName' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useCompanies(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useCompanies(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
