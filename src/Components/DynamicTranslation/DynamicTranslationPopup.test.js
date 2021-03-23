import React from 'react';
import { mount } from 'enzyme';
import DynamicTranslationPopup from './DynamicTranslationPopup';
import '../../tests/setupTests';
import { waitToLoadMocks } from '../../tests/helpers';
import TestAppContext from '../../tests/TestAppContext';

describe('<DynamicTranslationPopup />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly changes data and closePopup', async () => {
    const closeSpy = jest.fn();

    const wrapper = mount(
      <TestAppContext rbs>
        <DynamicTranslationPopup
          value="Company"
          close={closeSpy}
          scope="random"
        />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    await waitToLoadMocks();
    wrapper.update();

    let input = wrapper.find('input')
      .at(1);
    input.simulate('change', { target: { value: 'test_value' } });
    wrapper.update();
    input = wrapper.find('input')
      .at(1);
    expect(input.prop('value'))
      .toBe('test_value');

    const saveButton = wrapper.find('button')
      .at(2);

    saveButton.simulate('click');
    wrapper.update();
    await waitToLoadMocks();

    expect(closeSpy)
      .toHaveBeenCalledTimes(1);
  });
});
