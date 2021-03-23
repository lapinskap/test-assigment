import { renderHook } from '@testing-library/react-hooks';
import useBillingUnits from './useBillingUnits';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useBillingUnits', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useBillingUnits('a43275e4-eeb2-11ea-adc1-0242ac1200021', true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns empty array when company is missing', async () => {
    const { result } = renderHook(() => useBillingUnits(null));
    await waitToLoadMocks();
    expect(result.current).toMatchObject([]);
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useBillingUnits('a43275e4-eeb2-11ea-adc1-0242ac1200021'));
    await waitToLoadMocks();
    expect('id' in result.current[0] && 'name' in result.current[0]).toBeTruthy();
  });
});
