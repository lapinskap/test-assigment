import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import TranslationListing from '../utils/listing';
import fetchScopeOptions from '../utils/fetchScopeOptions';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';
import { TRANSLATOR_SERVICE } from '../../../utils/Api';
import { translationTranslateSimplePermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

export const SIMPLE_VALUE_TYPE = 2;

export default function Simple({ language }) {
  const [scopeOptions, setScopeOptions] = useState([]);
  useEffect(() => {
    fetchScopeOptions(SIMPLE_VALUE_TYPE, mockScopeOptions)
      .then((res) => {
        setScopeOptions(res);
      });
  }, []);

  const exportContext = new ExportContext(
    {
      service: TRANSLATOR_SERVICE,
      path: '/translations/export/simple',
      permission: translationTranslateSimplePermissionWrite,
      fileName: `simple_translation_${language}`,
      handleAdditionalFilters: () => [
        {
          id: 'type',
          value: SIMPLE_VALUE_TYPE,
        },
        {
          id: 'language',
          value: language,
        },
      ],
    },
  );

  return language ? (
    <TranslationListing
      language={language}
      mockData={mockData}
      type={SIMPLE_VALUE_TYPE}
      scopeOptions={scopeOptions}
      exportContext={exportContext}
    />
  ) : null;
}

const mockScopeOptions = [
  { value: 'user', label: 'Użytkownik' },
  { value: 'category', label: 'Kategoria' },
  { value: 'product', label: 'Produkt' },
];

export const mockData = [
  {
    id: 'ecommerce_value_1',
    code: 'ecommerce_value_1',
    scope: 'product',
    phrase: 'Włączony',
    translation: '',
    suggestion: 'Enabled (Cms)',
  },
  {
    id: 'ecommerce_value_2',
    code: 'ecommerce_value_2',
    scope: 'product',
    phrase: 'Dostępność',
    translation: '',
    suggestion: 'Availability',
  },
  {
    id: 'ecommerce_value_3',
    code: 'ecommerce_value_3',
    scope: 'category',
    phrase: 'Poziom',
    translation: 'Level',
    suggestion: '',
  },
  {
    id: 'ecommerce_value_4',
    code: 'ecommerce_value_4',
    scope: 'category',
    phrase: 'Nazwa',
    translation: 'Name',
    suggestion: 'Name (Firma)',
  },
  {
    id: 'ecommerce_value_5',
    code: 'ecommerce_value_5',
    scope: 'user',
    phrase: 'Nazwisko',
    translation: '',
    suggestion: 'Lastname (Pracownik)',
  },
  {
    id: 'ecommerce_value_6',
    code: 'ecommerce_value_6',
    scope: 'user',
    phrase: 'Imię',
    translation: 'First Name',
    suggestion: 'Firstname (Pracownik)',
  },
  {
    id: 'ecommerce_value_7',
    code: 'ecommerce_value_7',
    scope: 'product',
    phrase: 'Nazwa',
    translation: '',
    suggestion: 'Name (Firma)',
  },
  {
    id: 'ecommerce_value_8',
    code: 'ecommerce_value_8',
    scope: 'product',
    phrase: 'Cena',
    translation: '',
    suggestion: 'Price (Firma)',
  },
  {
    id: 'ecommerce_value_9',
    code: 'ecommerce_value_9',
    scope: 'user',
    phrase: 'Telefon',
    translation: 'Phone',
    suggestion: 'Phone (Pracownik)',
  },
  {
    id: 'ecommerce_value_10',
    code: 'ecommerce_value_10',
    scope: 'user',
    phrase: 'Kod pocztowy',
    translation: '',
    suggestion: 'Post code',
  },
  {
    id: 'ecommerce_value_11',
    code: 'ecommerce_value_11',
    scope: 'user',
    phrase: 'Adres email',
    translation: 'E-mail address',
    suggestion: '',
  },
];

Simple.propTypes = {
  language: PropTypes.string,
};

Simple.defaultProps = {
  language: '',
};
