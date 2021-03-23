import { renderHook } from '@testing-library/react-hooks';
import useDictionariesMap from './useDictionariesMap';
import { waitToLoadMocks } from '../../../tests/helpers';

const codes = ['random_code', 'random_code_2'];

describe('useDictionariesMap', () => {
  it('returns dictionaries map items as options', async () => {
    const { result } = renderHook(() => useDictionariesMap(codes));
    await waitToLoadMocks();
    expect(result.current.has('random_code') && result.current.has('random_code_2')).toBeTruthy();
    const dictionary = result.current.get('random_code');
    expect('value' in dictionary[0] && 'label' in dictionary[0]).toBeTruthy();
  });
  it('returns dictionaries map items', async () => {
    const { result } = renderHook(() => useDictionariesMap(codes, false));
    await waitToLoadMocks();
    const dictionary = result.current.get('random_code');
    expect('value' in dictionary[0] && 'key' in dictionary[0]).toBeTruthy();
  });
  it('returns empty array when no codes', async () => {
    const { result } = renderHook(() => useDictionariesMap([], false));
    await waitToLoadMocks();
    expect([...result.current].length).toBe(0);
  });
});
