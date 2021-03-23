import PropTypes from 'prop-types';
import React, {
  useState, useCallback, useEffect, useContext,
} from 'react';
import { Modal } from 'reactstrap';
// eslint-disable-next-line import/no-cycle
import Form from '../Form';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../utils/Api';
// eslint-disable-next-line import/no-cycle
import { SIMPLE_VALUE_TYPE } from '../../Pages/Translation/Simple';
import { dynamicNotification } from '../../utils/Notifications';
import __ from '../../utils/Translations';
import LanguagesTabs from './LanguageTabs';
import { translationTranslateSimplePermissionWrite } from '../../utils/RoleBasedSecurity/permissions';
import { hasAccessTo } from '../../utils/RoleBasedSecurity/filters';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';

export default function DynamicTranslationPopup({
  close, scope, value,
}) {
  const { userInfo } = useContext(RbsContext);
  const [data, updateData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
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
    fetchTranslationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTranslationData = async () => {
    if (hasAccessTo(userInfo, translationTranslateSimplePermissionWrite)) {
      await restApiRequest(TRANSLATOR_SERVICE, '/translations', 'POST', {
        body: {
          scope,
          phrase: value,
          type: SIMPLE_VALUE_TYPE,
        },
      }, null);
    }

    const result = await restApiRequest(TRANSLATOR_SERVICE, '/translations', 'GET', {
      params: {
        scope,
        phrase: value,
        itemsPerPage: 10000,
      },
    }, mockSimpleValues);

    updateData(result);
    setOriginalData(result.map((item) => ({ ...item })));
    setLoading(false);
  };

  const save = async () => {
    try {
      setLoading(true);
      const promises = [];
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].translation !== originalData[i].translation) {
          const promise = restApiRequest(TRANSLATOR_SERVICE, `/translations/${data[i].id}`, 'PATCH', {
            body: {
              translation: data[i].translation,
            },
          }, null);
          promises.push(promise);
        }
      }
      await Promise.all(promises);
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
          id="translationForm"
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
                permission: translationTranslateSimplePermissionWrite,
                disabled: loading,
              },
            ],
            togglePopup: close,
            title: `${value} (${scope})`,
            translateTitle: false,
            formGroups: [
              {
                formElements: [
                  {
                    component: <LanguagesTabs key="languages_tab" setCurrLanguage={setCurrLanguage} currLanguage={currLanguage} />,
                  },
                  {
                    id: 'phrase',
                    label: 'Oryginalna wartość',
                    type: 'text',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'translation',
                    label: 'Tłumaczenie',
                    type: 'text',
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

DynamicTranslationPopup.propTypes = {
  close: PropTypes.func.isRequired,
  scope: PropTypes.string.isRequired,
  value: PropTypes.string,
};

DynamicTranslationPopup.defaultProps = {
  value: '',
};

const mockSimpleValues = [
  {
    id: 4,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    phrase: 'Firma',
    language: 'en',
    type: 2,
  },
  {
    id: 5,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    phrase: 'Firma',
    language: 'UA',
    type: 2,
  },
  {
    id: 6,
    scope: 'company_company_city',
    code: 'company_company_city_6c76933666a8',
    phrase: 'Firma',
    language: 'FR',
    type: 2,
  },
];
