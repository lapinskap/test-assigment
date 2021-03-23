import { renderHook } from '@testing-library/react-hooks';
import useOperatorRoles, { IRI_PREFIX } from './useOperatorRoles';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useOperatorRoles', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useOperatorRoles(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useOperatorRoles());
    await waitToLoadMocks();
    expect('name' in result.current[0] && 'id' in result.current[0] && 'description' in result.current[0]).toBeTruthy();
  });
  it('returns iri correctly', async () => {
    const { result } = renderHook(() => useOperatorRoles(false, true));
    await waitToLoadMocks();
    expect(result.current[0].id.startsWith(IRI_PREFIX)).toBeTruthy();
  });
});
