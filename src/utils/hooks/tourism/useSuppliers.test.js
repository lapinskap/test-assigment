import { renderHook } from '@testing-library/react-hooks';
import useSuppliers, { IRI_PREFIX } from './useSuppliers';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('Tourism', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useSuppliers(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useSuppliers());
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'name' in result.current[0]).toBeTruthy();
  });
  it('receives filter', async () => {
    const { result } = renderHook(() => useSuppliers(false, 'name', '10clouds'));
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'name' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useSuppliers(null, null, false, true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
});
