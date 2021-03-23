import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../../tests/setupTests';
import TestAppContext from '../../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../../tests/helpers';

describe('compnay employee list', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index match={{ params: { companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
