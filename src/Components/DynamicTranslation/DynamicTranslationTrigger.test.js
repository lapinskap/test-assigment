import React from 'react';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';
import DynamicTranslationTrigger from './DynamicTranslationTrigger';
import '../../tests/setupTests';

describe('<DynamicTranslationTrigger />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render nothing when no value', () => {
    const tree = create(<DynamicTranslationTrigger
      value={null}
      isCms
      code="random"
    />)
      .toJSON();

    expect(tree)
      .toBe(null);
  });

  it('open and close popup for simple translations', () => {
    const wrapper = shallow(<DynamicTranslationTrigger
      value="Company"
      isCms={false}
      scope="random"
    />);
    const icon = wrapper.find('i')
      .at(0);
    icon.simulate('click');
    wrapper.update();
    const popup = wrapper.find('DynamicTranslationPopup');
    expect(popup.length)
      .toBe(1);
    popup.prop('close')();
    wrapper.update();
    expect(wrapper.find('DynamicTranslationPopup').length).toBe(0);
  });

  it('open and close popup for cms translations', () => {
    const wrapper = shallow(<DynamicTranslationTrigger
      value="Company"
      isCms
      code="random"
    />);
    const icon = wrapper.find('i')
      .at(0);
    icon.simulate('click');
    wrapper.update();
    const popup = wrapper.find('DynamicCmsTranslationPopup');
    expect(popup.length)
      .toBe(1);
    popup.prop('close')();
    wrapper.update();
    expect(wrapper.find('DynamicCmsTranslationPopup').length).toBe(0);
  });
});
