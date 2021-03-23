import { renderHook } from '@testing-library/react-hooks';
import useSuppliers from './useSuppliers';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useOperatorRoles', () => {
  it('returns company options', async () => {
    const { result } = renderHook(() => useSuppliers(true, true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns group data array', async () => {
    const { result } = renderHook(() => useSuppliers());
    await waitToLoadMocks();
    expect(
      'objectName' in result.current[0]
        && 'supplierBusinessID' in result.current[0]
        && 'objectCooperationArea' in result.current[0]
        && 'city' in result.current[0],
    ).toBeTruthy();
  });
});
