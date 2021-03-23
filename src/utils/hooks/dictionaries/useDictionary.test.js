import { renderHook } from '@testing-library/react-hooks';
import useDictionary from './useDictionary';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useDictionary', () => {
  it('returns dictionary items as options', async () => {
    const { result } = renderHook(() => useDictionary('random_code'));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useDictionary('random_code', false));
    await waitToLoadMocks();
    expect('key' in result.current[0] && 'value' in result.current[0]).toBeTruthy();
  });

  it('returns empty array when no code', async () => {
    const { result } = renderHook(() => useDictionary(null, false));
    await waitToLoadMocks();
    expect(result.current.length).toBe(0);
  });
});
