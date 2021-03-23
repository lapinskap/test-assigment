import React from 'react';
import { create } from 'react-test-renderer';
import LanguageWrapper, { loadInterfaceTranslation } from './languageWrapper';
import { wait } from '../../tests/helpers';
import '../../tests/setupTests';
import { LANGUAGE_STORAGE_KEY } from './LanguageContext';

describe('languageWrapper', () => {
  afterEach(() => {
    window.translations = null;
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('fetches interfeace translations', async () => {
    await loadInterfaceTranslation('en');
    expect(Object.keys(window.translations).length).toBe(0);
  });

  test('LanguageWrapper does nothing for default language', async () => {
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    const wrapper = create((
      <LanguageWrapper><input /></LanguageWrapper>
    ));
    await wait(100);
    wrapper.update();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  test('LanguageWrapper render correctly for no default language', async () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    const wrapper = create((
      <LanguageWrapper><input /></LanguageWrapper>
    ));
    await wait(100);
    wrapper.update();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
