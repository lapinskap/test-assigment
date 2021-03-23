import React from 'react';
import { mount } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import Popup from './popup';
import '../../tests/setupTests';

describe('<Popup />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correct in default state', () => {
    const subject = mount(<Popup id="testPopup" toggle={() => {}} />);
    expect(EnzymeToJson(subject)).toMatchSnapshot();
  });
});
