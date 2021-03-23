import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import ActionColumn from './actionColumn';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

describe('ButtonList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const spyOnClick = jest.fn();
    const buttons = [
      {
        size: 'lg',
        color: 'success',
        className: 'mr-2',
        type: 'submit',
        disabled: false,
      },
      {
        size: 'lg',
        color: 'success',
        className: 'mr-2',
        text: 'Save',
        type: 'button',
        disabled: false,
      },
      {
        text: 'Delete',
        onClick: spyOnClick,
      },
      {
        size: 'sm',
        color: 'danger',
        className: 'random-classname',
        disabled: false,
        runBefore: null,
        href: '/',
      },

    ];
    const wrapper = mount((
      <TestAppContext router>
        <ActionColumn buttons={buttons} data={{ id: 1 }} />
      </TestAppContext>
    ));
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();

    const firstButton = wrapper.find('Button').at(0);
    firstButton.simulate('click');

    const secondButton = wrapper.find('Button').at(1);
    secondButton.simulate('click');

    const thirdButton = wrapper.find('Button').at(2);
    thirdButton.simulate('click');

    expect(spyOnClick).toHaveBeenCalledTimes(1);
  });
});
