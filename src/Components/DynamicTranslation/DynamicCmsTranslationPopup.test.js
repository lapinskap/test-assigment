import React from 'react';
import { mount } from 'enzyme';
import DynamicCmsTranslationPopup from './DynamicCmsTranslationPopup';
import '../../tests/setupTests';
import { waitToLoadMocks } from '../../tests/helpers';
import TestAppContext from '../../tests/TestAppContext';

describe('<DynamicCmsTranslationPopup />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly changes data and closePopup', async () => {
    const closeSpy = jest.fn();

    const wrapper = mount(
      <TestAppContext language rbs>
        <DynamicCmsTranslationPopup
          value="Company"
          close={closeSpy}
          code="random"
          isTitle={false}
        />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    await waitToLoadMocks();
    wrapper.update();

    let wysiwyg = wrapper.find('Wysiwyg')
      .at(1);
    wysiwyg.prop('onChange')('translation', 'test_value');
    wrapper.update();
    wysiwyg = wrapper.find('Wysiwyg').at(1);
    expect(wysiwyg.prop('value'))
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
