import { renderHook } from '@testing-library/react-hooks';
import useOperators, { IRI_PREFIX } from './useOperators';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useOperatorRoles', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useOperators(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useOperators());
    await waitToLoadMocks();
    expect(
      'firstName' in result.current[0] && 'id' in result.current[0] && 'username' in result.current[0] && 'lastName' in result.current[0],
    ).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useOperators(false, 'randomField', 'randomValue', true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
  it('blocks fetching correctly and returns empty array', async () => {
    const { result } = renderHook(() => useOperators(false, 'randomField', 'randomValue', true, true));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
