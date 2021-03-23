import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import ButtonList from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

describe('ButtonList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const spyOnClick = jest.fn();
    const div = document.createElement('div');
    div.setAttribute('id', 'button-list-tooltip-2');
    document.body.appendChild(div);
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
        tooltip: 'Simple tooltip info',
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
        <ButtonList buttons={buttons} />
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
