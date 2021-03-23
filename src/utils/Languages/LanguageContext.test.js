import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import LanguageContext, { useDefaultLanguage, useLanguages } from './LanguageContext';
import { mockLanguages } from './languageWrapper';
import { waitToLoadMocks } from '../../tests/helpers';

describe('Language Context', () => {
  // eslint-disable-next-line react/prop-types
  const wrapper = ({ children }) => (
    <LanguageContext.Provider value={{ languagesConfig: mockLanguages, defaultLanguage: 'pl' }}>{children}</LanguageContext.Provider>
  );
  test('useLanguages returns languages without default options', async () => {
    const { result } = renderHook(() => useLanguages(), { wrapper });
    await waitToLoadMocks();
    expect(
      'code' in result.current[0]
      && 'label' in result.current[0]
      && 'isDefault' in result.current[0]
      && 'shortLabel' in result.current[0],
    ).toBeTruthy();
    expect(result.current.find((el) => el.code === 'pl')).toBe(undefined);
  });
  test('useLanguages returns languages without default options', async () => {
    const { result } = renderHook(() => useLanguages(true, true), { wrapper });
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
    expect(result.current.find((el) => el.value === 'pl')).not.toBe(undefined);
  });
  test('useDefaultLanguage returns default langugae from Context', () => {
    const { result } = renderHook(() => useDefaultLanguage(), { wrapper });
    expect(result.current).toBe('pl');
  });
});
