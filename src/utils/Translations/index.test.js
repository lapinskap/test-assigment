import __, { setTranslations, fetchMissingTranslations } from './index';
import { removeLanguage, setLanguage } from '../Languages/LanguageContext';

describe('Translations', () => {
  beforeEach(() => {
    setLanguage('en');
    setTranslations({
      Firma: 'Company',
      Product: null,
      'Lista firm': 'Company list',
    });
    setTranslations({
      'Ta wartość musi być w zakresie {0} - {1}': 'This value has to be in range {0} - {1}',
    });
  });
  afterEach(() => {
    removeLanguage();
  });

  it('returns translation for phrase that is translated', () => {
    const phrase = 'Firma';
    expect(__(phrase)).toBe('Company');
  });
  it('returns translation for phrase that is translated when unneeded args passed', () => {
    const phrase = 'Firma';
    expect(__(phrase, [5])).toBe('Company');
  });

  it('returns translation for multi-word phrase that is translated', () => {
    const phrase = 'Lista firm';
    expect(__(phrase)).toBe('Company list');
  });

  it('returns original phrase for phrase that is not translated', () => {
    const phrase = 'Produkt';
    expect(__(phrase)).toBe('Produkt');
  });

  it('returns original phrase for phrase that is not in translations object', () => {
    const phrase = 'Katalog produktów';
    expect(__(phrase)).toBe('Katalog produktów');
  });

  it('returns translation for phrase with dynamic value injection', () => {
    const phrase = 'Ta wartość musi być w zakresie {0} - {1}';
    const args = [1, 10];
    expect(__(phrase, args)).toBe('This value has to be in range 1 - 10');
  });

  it('returns translation for phrase with dynamic value injection when no args passed', () => {
    const phrase = 'Ta wartość musi być w zakresie {0} - {1}';
    expect(__(phrase)).toBe('This value has to be in range {0} - {1}');
  });

  it('returns original phrase for phrase that is not translated with dynamic value injection', () => {
    const phrase = 'Minimalna ilość znaków dla tego pola to {0}';
    const args = [9];
    expect(__(phrase, args)).toBe('Minimalna ilość znaków dla tego pola to 9');
  });
  it('updates missing tranlsations', async () => {
    await fetchMissingTranslations('firma');
    expect(window.translations.firma).toBe('company');
  });
});
