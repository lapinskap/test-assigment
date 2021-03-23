import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import Form from '../../../Components/Form';
import { useLanguages } from '../../../utils/Languages/LanguageContext';
import Popup from '../../../Components/Popup/popup';

export default function TranslationForm({
  close, initialData, language, onSave,
}) {
  const [data, updateData] = useState({ ...initialData });
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  const languages = useLanguages();
  const currentLanguage = languages.find((lang) => lang.code === language);
  const title = `Tłumaczenie na ${currentLanguage ? currentLanguage.label.toLowerCase() : ''}`;
  return (
    <>
      <Popup id="translationPopup" isOpen toggle={close} unmountOnClose size="lg" className="modal-xxl">
        <Form
          id="translationForm"
          data={data}
          config={{
            isInPopup: true,
            buttons: [
              {
                text: 'Zapisz',
                type: 'submit',
                color: 'primary',
              },
            ],
            onSubmit: () => {
              close();
              onSave(data.id, data.translation);
            },
            togglePopup: close,
            title,
            defaultOnChange: onChange,
            noCards: true,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'phrase',
                    label: 'Oryginalna wartość:',
                    type: 'text',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'translation',
                    label: 'Tłumaczenie:',
                    type: 'text',
                  },
                ],
              },
            ],
          }}
        />
      </Popup>
    </>
  );
}
TranslationForm.propTypes = {
  close: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialData: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
