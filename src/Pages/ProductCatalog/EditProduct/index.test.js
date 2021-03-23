import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';
import { initSession } from '../../../utils/RoleBasedSecurity/Session';

describe('category edit', () => {
  it('renders without crashing when adding new item', () => {
    initSession();
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index match={{ params: { productId: '-1' } }} />
      </TestAppContext>,
    );
    expect(wrapper).toHaveLength(1);
  });

  it('renders without crashing when editing item', () => {
    initSession();
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index match={{ params: { productId: '1' } }} />
      </TestAppContext>,
    );
    expect(wrapper).toHaveLength(1);
  });
});
