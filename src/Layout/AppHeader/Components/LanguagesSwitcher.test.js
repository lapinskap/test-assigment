import React from 'react';
import { mount } from 'enzyme';
import renderer, { act } from 'react-test-renderer';
import LanguagesSwitcher from './LanguagesSwitcher';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';
import { wait } from '../../../tests/helpers';
import { removeLanguage } from '../../../utils/Languages/LanguageContext';

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

describe('<Languages />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
    removeLanguage();
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <TestAppContext rbs language>
          <LanguagesSwitcher />
        </TestAppContext>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have correct behavior on all buttons', async () => {
    const wrapper = mount(
      <TestAppContext rbs language>
        <LanguagesSwitcher />
      </TestAppContext>,
    );
    await wait(200);
    wrapper.update();
    const langFlag = wrapper.find('Flag').at(1);
    expect(langFlag.props().value).toBe(undefined);
    await act(async () => {
      await langFlag.simulate('click');
    });
    wrapper.update();
    const DropdownItem = wrapper.find('DropdownItem').at(0);
    act(() => {
      DropdownItem.simulate('click');
    });
  });

  it('should changing language method work', async () => {
    const wrapper = mount(
      <TestAppContext rbs language>
        <LanguagesSwitcher />
      </TestAppContext>,
    );
    await wait(200);
    wrapper.update();
    const DropdownItem = wrapper.find('DropdownItem').at(0);
    act(() => {
      DropdownItem.simulate('click');
    });
    expect(DropdownItem.props().value).toBe(undefined);
  });
});
