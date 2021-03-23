import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../tests/helpers';
import { initSession } from '../../../../utils/RoleBasedSecurity/Session';

describe('operator role edit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing when adding new item', async () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'employee_permission-code-2');
    document.body.appendChild(div);
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index match={{ params: { roleId: '-1' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });

  it('renders without crashing when editing item', async () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'employee_permission-code-2');
    initSession();
    const wrapper = mount(
      <TestAppContext redux={1} router={1}>
        <Index match={{ params: { roleId: '1' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
