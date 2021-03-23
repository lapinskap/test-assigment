import { renderHook } from '@testing-library/react-hooks';
import usePdfForms, { IRI_PREFIX } from './usePdfForms';
import { waitToLoadMocks } from '../../../tests/helpers';
import useAhrRoles from '../company/useAhrRoles';

describe('usePdfForms', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => usePdfForms(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => usePdfForms());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'description' in result.current[0]).toBeTruthy();
  });
  it('receives filter', async () => {
    const { result } = renderHook(() => usePdfForms(false, 'name', '10clouds'));
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'description' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => usePdfForms(null, null, false, true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useAhrRoles(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
