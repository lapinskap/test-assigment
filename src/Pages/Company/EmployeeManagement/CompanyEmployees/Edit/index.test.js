import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../../tests/setupTests';
import TestAppContext from '../../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../../tests/helpers';
import { initSession } from '../../../../../utils/RoleBasedSecurity/Session';

describe('compnay employee list', () => {
  it('renders without crashing when adding new item', async () => {
    await initSession();
    const tooltip1 = document.createElement('div');
    tooltip1.setAttribute('id', 'form_tooltip_businessPhone');
    const tooltip2 = document.createElement('div');
    tooltip2.setAttribute('id', 'form_tooltip_businessEmail');
    const tooltip3 = document.createElement('div');
    tooltip3.setAttribute('id', 'form_tooltip_province');
    const tooltip4 = document.createElement('div');
    tooltip4.setAttribute('id', 'form_tooltip_activeTo');
    document.body.appendChild(tooltip1);
    document.body.appendChild(tooltip2);
    document.body.appendChild(tooltip3);
    document.body.appendChild(tooltip4);

    const wrapper = mount(
      <TestAppContext redux={1} router={1} rbs={1}>
        <Index match={{ params: { employeeId: '-1' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();

    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
  it('renders without crashing when editing item', async () => {
    await initSession();
    const tooltip1 = document.createElement('div');
    tooltip1.setAttribute('id', 'form_tooltip_businessPhone');
    const tooltip2 = document.createElement('div');
    tooltip2.setAttribute('id', 'form_tooltip_businessEmail');
    const tooltip3 = document.createElement('div');
    tooltip3.setAttribute('id', 'form_tooltip_province');
    const tooltip4 = document.createElement('div');
    tooltip4.setAttribute('id', 'form_tooltip_activeTo');
    const tooltip5 = document.createElement('div');
    tooltip5.setAttribute('id', 'generate_password_tooltip');
    document.body.appendChild(tooltip1);
    document.body.appendChild(tooltip2);
    document.body.appendChild(tooltip3);
    document.body.appendChild(tooltip4);
    document.body.appendChild(tooltip5);

    const wrapper = mount(
      <TestAppContext redux={1} router={1} rbs={1}>
        <Index match={{ params: { employeeId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();

    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
