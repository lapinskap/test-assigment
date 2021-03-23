import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import TranslationListing from '../utils/listing';
import fetchScopeOptions from '../utils/fetchScopeOptions';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';
import { TRANSLATOR_SERVICE } from '../../../utils/Api';
import {
  translationTranslateSimplePermissionWrite,
} from '../../../utils/RoleBasedSecurity/permissions';

export const INTERFACE_TYPE = 1;

export default function Interface({ language }) {
  const [scopeOptions, setScopeOptions] = useState([]);

  useEffect(() => {
    fetchScopeOptions(INTERFACE_TYPE, mockScopeOptions)
      .then((res) => {
        setScopeOptions(res);
      });
  }, []);

  const exportContext = new ExportContext(
    {
      service: TRANSLATOR_SERVICE,
      path: '/translations/export/simple',
      permission: translationTranslateSimplePermissionWrite,
      fileName: `interface_translation_${language}`,
      handleAdditionalFilters: () => [
        {
          id: 'type',
          value: INTERFACE_TYPE,
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
      type={INTERFACE_TYPE}
      scopeOptions={scopeOptions}
      exportContext={exportContext}
    />
  ) : null;
}

const mockScopeOptions = [
  { value: 'interface_omb', label: 'Interface OMB' },
];

export const mockData = [
  {
    id: 'interface_label_3',
    code: 'interface_label_3',
    scope: 'interface_omb',
    phrase: 'Katalog produktów',
    translation: '',
    suggestion: '',
  },
  {
    id: 'interface_label_4',
    code: 'interface_label_4',
    scope: 'interface_omb',
    phrase: 'Lista dostawców',
    translation: '',
    suggestion: 'Provider list (Pracownik);Providers(Firma);All Providers(AHR)',
  },
  {
    id: 'interface_label_5',
    code: 'interface_label_5',
    scope: 'interface_omb',
    phrase: 'Firma',
    translation: '',
    suggestion: 'Company (Pracownik)',
  },
  {
    id: 'interface_label_6',
    code: 'interface_label_6',
    scope: 'interface_omb',
    phrase: 'Administracja',
    translation: 'Administration',
    suggestion: '',
  },
  {
    id: 'interface_label_7',
    code: 'interface_label_7',
    scope: 'interface_omb',
    phrase: 'Raport',
    translation: '',
    suggestion: 'Report (AHR)',
  },
  {
    id: 'interface_label_8',
    code: 'interface_label_8',
    scope: 'interface_omb',
    phrase: 'Tłumaczenia',
    translation: 'Translation',
    suggestion: '',
  },
  {
    id: 'interface_label_9',
    code: 'interface_label_9',
    scope: 'interface_omb',
    phrase: 'CMS',
    translation: 'CMS',
    suggestion: 'CMS (Firma)',
  },
  {
    id: 'interface_label_10',
    code: 'interface_label_10',
    scope: 'interface_omb',
    phrase: 'Standardy',
    translation: '',
    suggestion: '',
  },
  {
    id: 'interface_label_11',
    code: 'interface_label_11',
    scope: 'interface_omb',
    phrase: 'Operatorzy MB',
    translation: '',
    suggestion: '',
  },
];

Interface.propTypes = {
  language: PropTypes.string,
};

Interface.defaultProps = {
  language: '',
};
