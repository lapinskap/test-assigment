export const HEADER_SECTION_TYPE = 'header';
export const FORM_SECTION_TYPE = 'form';
export const CONTENT_SECTION_TYPE = 'content';

export const FIELD_TYPES_CONFIG = [
  { code: 'text', name: 'Tekst', defaultLabel: null },
  { code: 'checkbox', name: 'Checkbox', defaultLabel: null },
  { code: 'firstname', name: 'Imię', defaultLabel: 'Imię' },
  { code: 'lastname', name: 'Nazwisko', defaultLabel: 'Nazwisko' },
  { code: 'email', name: 'Adres e-mail', defaultLabel: 'Adres e-mail' },
  { code: 'phone', name: 'Numer telefonu', defaultLabel: 'Numer telefonu' },
  { code: 'pesel', name: 'Pesel', defaultLabel: 'Pesel' },
  { code: 'postcode', name: 'Kod pocztowy', defaultLabel: 'Kod pocztowy' },
  { code: 'date', name: 'Data', defaultLabel: 'Data' },
];

export const availableFields = FIELD_TYPES_CONFIG.map(({ code }) => code);
