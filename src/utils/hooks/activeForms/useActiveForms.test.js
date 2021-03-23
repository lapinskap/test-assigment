import { renderHook } from '@testing-library/react-hooks';
import useActiveForms, { IRI_PREFIX } from './useActiveForms';
import { waitToLoadMocks } from '../../../tests/helpers';
import useAhrRoles from '../company/useAhrRoles';

describe('useActiveForms', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useActiveForms(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useActiveForms());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'name' in result.current[0]).toBeTruthy();
  });
  it('receives filter', async () => {
    const { result } = renderHook(() => useActiveForms(false, 'name', '10clouds'));
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'name' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useActiveForms(null, null, false, true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useAhrRoles(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
