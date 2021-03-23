import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Form from '../../../../Components/Form';
import { ScopeTypes } from '../../utils/fetchScopeOptions';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import Popup from '../../../../Components/Popup/popup';

export default function ScopeListing({ isOpen, close }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onSave = async () => {
    try {
      await restApiRequest(TRANSLATOR_SERVICE,
        '/scopes',
        'POST',
        {
          body: {
            ...data,
          },
        });
      dynamicNotification('Pomyślnie dodano nowy zakres');
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || 'Nie udało się dodać nowego zakresu', 'error');
    }
  };

  return (
    <>
      <Popup id="translationScopePopup" isOpen={isOpen} toggle={close} unmountOnClose>
        <Form
          id="translationScopeForm"
          data={data}
          config={{
            defaultOnChange: onChange,
            isInPopup: true,
            buttons: [
              {
                text: 'Zapisz',
                type: 'submit',
              },
            ],
            onSubmit: () => {
              onSave(data.id, data.translation);
            },
            togglePopup: close,
            title: 'Dodaj nowy zakres',
            formGroups: [
              {
                formElements: [
                  {
                    id: 'code',
                    label: 'Kod',
                    type: 'text',
                    validation: ['required'],
                  },
                  {
                    id: 'title',
                    label: 'Tytuł',
                    type: 'text',
                    validation: ['required'],
                  },
                  {
                    id: 'type',
                    label: 'Typ',
                    type: 'select',
                    valueFormatter: 'number',
                    options: ScopeTypes,
                    validation: ['required'],
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

ScopeListing.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
};
