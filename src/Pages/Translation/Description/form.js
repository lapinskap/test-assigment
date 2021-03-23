import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Loader as LoaderAnim } from 'react-loaders';
import Form from '../../../Components/Form';
import ContentLoading from '../../../Components/Loading/contentLoading';
import { useLanguages } from '../../../utils/Languages/LanguageContext';
import Popup from '../../../Components/Popup/popup';

const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;

export default function DescriptionForm({
  close, initialData, language, onSave,
}) {
  const [data, updateData] = useState({ ...initialData });
  const [isLoading, setIsLoading] = useState(false);
  const languages = useLanguages();
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const currentLanguage = languages.find((lang) => lang.code === language);
  const title = `${data.title || data.code} ${currentLanguage ? currentLanguage.label.toLowerCase() : ''}`;
  return (
    <>
      <Popup id="translateDescriptionPopup" isOpen toggle={close} unmountOnClose size="lg" className="modal-xxl">
        <ContentLoading
          message={spinner}
          show={isLoading}
        >
          <Form
            id="translateDescriptionForm"
            data={data}
            config={{
              title,
              isInPopup: true,
              buttons: [
                {
                  text: 'Zapisz',
                  type: 'submit',
                },
              ],
              onSubmit: async () => {
                setIsLoading(true);
                await onSave(data.id, data.translation);
                close();
              },
              togglePopup: close,
              defaultOnChange: onChange,
              noCards: true,
              groupsAsColumns: true,
              formGroups: [
                {
                  formElements: [
                    {
                      id: 'phrase',
                      label: 'Oryginalna wartość',
                      type: 'wysiwyg',
                      props: {
                        height: 400,
                        disabled: true,
                      },
                    },
                  ],
                },
                {
                  formElements: [
                    {
                      id: 'translation',
                      label: 'Tłumaczenie',
                      type: 'wysiwyg',
                      props: {
                        height: 400,
                      },
                    },
                  ],
                },
              ],
            }}
          />
        </ContentLoading>
      </Popup>
    </>
  );
}

DescriptionForm.propTypes = {
  close: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialData: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
