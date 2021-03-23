import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { mount } from 'enzyme';
import SearchBox, { findData } from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';
import { findCompanies } from './filters';
import { wait } from '../../tests/helpers';

describe('findData()', () => {
  it('should work correctly', async () => {
    const inputText = 'Fake Company';
    const setCompanies = jest.fn((result) => {
      expect(result.length).toBe(0);
    });
    await findData(inputText, setCompanies, findCompanies);
    expect(setCompanies).toBeCalledTimes(1);
    // Do not call function when empty input
    await findData('', setCompanies, findCompanies);
    expect(setCompanies).toBeCalledTimes(1);
  });
});

describe('<SearchBox />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });

  it('renders correctly with default state', () => {
    const inputText = 'test input';
    const tree = renderer
      .create(<SearchBox inputText={inputText} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should Dropdown act correctly', async () => {
    const wrapper = mount(<SearchBox />);
    act(() => {
      const dropdown = wrapper.find('Dropdown').at(0);
      dropdown.simulate('click');
      wrapper.update();
      // should be false
      expect(wrapper.find('Dropdown').prop('isOpen')).toBe(false);
    });
    // should be true
    expect(wrapper.find('DropdownToggle').prop('aria-haspopup')).toBe(true);
  });

  it('should input setInputText method work', async () => {
    const wrapper = mount(
      <TestAppContext rbs router><SearchBox /></TestAppContext>,
    );
    const input = wrapper.find('input').at(0);
    act(() => {
      input.simulate('change', { target: { value: 'Lista' } });
    });
    wrapper.update();
    expect(wrapper.find('input').prop('value')).toBe('Lista');
    await wait(550); // wait to debounce
    wrapper.update();
    expect(wrapper.find('Dropdown').prop('isOpen')).toBe(true);

    act(() => {
      wrapper.find('Link').at(0).simulate('click');
    });
    wrapper.update();
    expect(wrapper.find('Dropdown').prop('isOpen')).toBe(false);
  });

  it('should input setShowSuggestions method work', async () => {
    const wrapper = mount(<SearchBox />);
    const input = wrapper.find('input').at(0);
    act(() => {
      input.simulate('focus');
      wrapper.update();
      expect(input).toBeTruthy();
    });
  });

  it('should dropdown item setShowSuggestions method work', async () => {
    const wrapper = mount(<SearchBox />);
    const dropdownItem = wrapper.find('Dropdown').at(0);
    act(() => {
      dropdownItem.simulate('click');
      wrapper.update();
      expect(dropdownItem.prop('isOpen')).toBe(false);
    });
    expect(dropdownItem.prop('disabled')).toBe(undefined);
  });
});
