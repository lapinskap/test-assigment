import { renderHook } from '@testing-library/react-hooks';
import useAgreementPlacement from './useAgreementPlacement';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useAgreementPlacement', () => {
  it('returns agreement placements options', async () => {
    const { result } = renderHook(() => useAgreementPlacement(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns agreement placements data array', async () => {
    const { result } = renderHook(() => useAgreementPlacement());
    await waitToLoadMocks();
    expect('label' in result.current[0] && 'id' in result.current[0]).toBeTruthy();
  });
});
