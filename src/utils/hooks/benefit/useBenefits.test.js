import { renderHook } from '@testing-library/react-hooks';
import useBenefits, { IRI_PREFIX } from './useBenefits';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useEmployees', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useBenefits(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useBenefits());
    await waitToLoadMocks();
    expect('name' in result.current[0] && 'supplierId' in result.current[0] && 'id' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useBenefits(false, 'randomField', 'randomValue', 'secondRandomField', 'secondRandomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useBenefits(false, 'randomField', 'randomValue', 'secondRandomField', 'secondRandomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
