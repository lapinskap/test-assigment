import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../tests/helpers';

describe('dictionary edit', () => {
  it('renders without crashing when adding new item', async () => {
    waitToLoadMocks();
    const wrapper = mount(
      <TestAppContext redux router>
        <Index match={{ params: { productId: '-1' } }} />
      </TestAppContext>,
    );
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });

  it('renders without crashing when editing item', async () => {
    const wrapper = mount(
      <TestAppContext redux router>
        <Index match={{ params: { productId: '1' } }} />
      </TestAppContext>,
    );
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
