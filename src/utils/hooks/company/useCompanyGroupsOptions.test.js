import { renderHook } from '@testing-library/react-hooks';
import useCompanyGroupsOptions from './useCompanyGroupsOptions';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('useCompanyGroupsOptions', () => {
  it('returns all groups', async () => {
    const { result } = renderHook(() => useCompanyGroupsOptions('a43275e4-eeb2-11ea-adc1-0242ac1200021', true, true, true, true));
    await waitToLoadMocks();
    const groups = result.current;
    expect('options' in groups[0] && 'label' in groups[0] && 'label' in groups[0].options[0] && 'value' in groups[0].options[0]).toBeTruthy();
    expect('options' in groups[1] && 'label' in groups[1] && 'label' in groups[1].options[0] && 'value' in groups[1].options[0]).toBeTruthy();
    expect('options' in groups[2] && 'label' in groups[2] && 'label' in groups[2].options[0] && 'value' in groups[2].options[0]).toBeTruthy();
    expect('options' in groups[3] && 'label' in groups[3] && 'label' in groups[3].options[0] && 'value' in groups[3].options[0]).toBeTruthy();
  });
  it('can provide only some groups', async () => {
    const { result } = renderHook(() => useCompanyGroupsOptions('a43275e4-eeb2-11ea-adc1-0242ac1200021'));
    await waitToLoadMocks();
    const groups = result.current;
    expect(Array.isArray(groups) && groups.length === 0).toBeTruthy();
  });
});
