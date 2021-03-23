import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';

describe('dictionary listing', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <TestAppContext redux router>
        <Index />
      </TestAppContext>,
    );
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
