import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import List from './index';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../../tests/helpers';

describe('Operators Listing', () => {
  it('renders correctly', async () => {
    const wrapper = mount(<TestAppContext router redux><List /></TestAppContext>);
    await waitToLoadMocks();
    wrapper.update();
    const toggleSwitch = wrapper.find('ToggleSwitch').at(0);
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
    toggleSwitch.prop('handleChange')(false);
    wrapper.update();
    await waitToLoadMocks();
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });
});
