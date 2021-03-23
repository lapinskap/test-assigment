import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'reactstrap';
// eslint-disable-next-line import/no-cycle
import Form from '../Form';
import { LAYOUT_TWO_COLUMNS } from '../Layouts';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../utils/Api';
import { dynamicNotification } from '../../utils/Notifications';
import __ from '../../utils/Translations';
import LanguagesTabs from './LanguageTabs';
import { useLanguages } from '../../utils/Languages/LanguageContext';
import { translationTranslateCmsPermissionWrite } from '../../utils/RoleBasedSecurity/permissions';

export default function DynamicCmsTranslationPopup({
  close, code, value, scope, isTitle,
}) {
  const languages = useLanguages();
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currLanguage, setCurrLanguage] = useState('en');

  const onChange = useCallback((key, newValue) => {
    const updatedData = [...data];
    const langData = updatedData.find((el) => el.language === currLanguage);
    if (langData) {
      langData[key] = newValue;
      updateData(updatedData);
    }
  }, [data, currLanguage]);
  useEffect(() => {
    if (languages.length) {
      fetchTranslationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);
  const fetchTranslationData = async () => {
    const result = await restApiRequest(TRANSLATOR_SERVICE, '/cms-translations', 'GET', {
      params: {
        code,
        itemsPerPage: 10000,
      },
    }, mockSimpleValues);
    const formData = languages.map(({ code: langCode }) => {
      const savedItem = result.find(({ language }) => language === langCode) || {};
      return {
        translation: '',
        title: '',
        ...savedItem,
        code,
        scope: scope || 'cms',
        language: langCode,
        phrase: value,
      };
    });
    updateData(formData);
    setLoading(false);
  };

  const save = async () => {
    try {
      setLoading(true);
      await restApiRequest(TRANSLATOR_SERVICE, '/cms/mass-save', 'POST', {
        body: {
          data,
        },
      }, null);
      close();
    } catch (e) {
      dynamicNotification(e.message || __('Nie udało się zapisać tłumaczeń'), 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen toggle={close} unmountOnClose size="lg" className="modal-xxl">
        <Form
          id="translationCmsForm"
          data={data.find((el) => el.language === currLanguage)}
          config={{
            defaultOnChange: onChange,
            isInPopup: true,
            buttons: [
              {
                color: 'light',
                text: 'Zamknij',
                onClick: close,
              },
              {
                text: 'Zapisz',
                onClick: save,
                permission: translationTranslateCmsPermissionWrite,
                disabled: loading,
              },
            ],
            togglePopup: close,
            title: code,
            translateTitle: false,
            formGroups: [
              {
                formElements: [
                  {
                    component: <LanguagesTabs key="languages_tab" setCurrLanguage={setCurrLanguage} currLanguage={currLanguage} />,
                  },
                  {
                    layout: LAYOUT_TWO_COLUMNS,
                    formElements: [
                      {
                        id: 'phrase',
                        label: 'Oryginalna wartość',
                        type: isTitle ? 'text' : 'wysiwyg',
                        props: {
                          height: 400,
                          disabled: true,
                        },
                      },
                      {
                        id: isTitle ? 'title' : 'translation',
                        label: 'Tłumaczenie',
                        type: isTitle ? 'text' : 'wysiwyg',
                        props: {
                          height: 400,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />
      </Modal>
    </>
  );
}

DynamicCmsTranslationPopup.propTypes = {
  close: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  scope: PropTypes.string,
  value: PropTypes.string.isRequired,
  isTitle: PropTypes.bool.isRequired,
};

DynamicCmsTranslationPopup.defaultProps = {
  scope: '',
};

const mockSimpleValues = [
  {
    id: 4,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    language: 'en',
    type: 2,
  },
  {
    id: 5,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    language: 'UA',
    type: 2,
  },
  {
    id: 6,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    language: 'FR',
    type: 2,
  },
];
