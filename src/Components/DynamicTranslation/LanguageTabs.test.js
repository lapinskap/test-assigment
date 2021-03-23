import React from 'react';
import { mount } from 'enzyme';
import LanguageTabs from './LanguageTabs';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';
import { wait } from '../../tests/helpers';

describe('<LanguageTabs />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('works correctly onFocus and onMode', async () => {
    const setCurrLanguageSpy = jest.fn((lang) => expect(lang).toBe('en'));
    const wrapper = mount(
      <TestAppContext language rbs>
        <LanguageTabs
          currLanguage="UK"
          setCurrLanguage={setCurrLanguageSpy}
        />
      </TestAppContext>,
    );
    await wait(200);
    wrapper.update();
    const engButton = wrapper.find('span').at(0);
    engButton.simulate('click');
    wrapper.update();
    expect(setCurrLanguageSpy).toHaveBeenCalledTimes(1);
  });
});
