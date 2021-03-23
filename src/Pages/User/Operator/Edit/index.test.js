import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import From from './index';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../tests/helpers';
import { deleteSession, initSession } from '../../../../utils/RoleBasedSecurity/Session';

describe('Operators Listing', () => {
  beforeEach(() => {
    initSession();
  });
  afterEach(() => {
    deleteSession();
  });

  it('renders correctly for edit operator form', async () => {
    const wrapper = mount(<TestAppContext router redux><From match={{ params: { operatorId: 1 } }} /></TestAppContext>);
    await waitToLoadMocks();
    wrapper.update();
    expect(EnzymeToJson(wrapper))
      .toMatchSnapshot();

    const changePasswordPopupButton = wrapper.find('Button')
      .at(1);
    changePasswordPopupButton.simulate('click');
    wrapper.update();
    expect(EnzymeToJson(wrapper))
      .toMatchSnapshot();
  });
  it('renders correctly for new operator form', async () => {
    const wrapper = mount(<TestAppContext router redux><From match={{ params: { operatorId: -1 } }} /></TestAppContext>);
    await waitToLoadMocks();
    wrapper.update();
    expect(EnzymeToJson(wrapper))
      .toMatchSnapshot();
  });
});
