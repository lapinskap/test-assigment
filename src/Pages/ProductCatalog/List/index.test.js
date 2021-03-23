import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('category edit', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
