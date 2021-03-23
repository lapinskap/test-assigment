import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../../Components/Form';
import { LAYOUT_THREE_COLUMNS } from '../../../../../../../Components/Layouts';
import __ from '../../../../../../../utils/Translations';
import Popup from '../../../../../../../Components/Popup/popup';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function ResetInfo({ isOpen, close }) {
  const [data, updateData] = useState({ defaultMessage: true, message: MOCK_DEFAULT_MESSAGE });
  const [customMessage, setCustomMessage] = useState('');

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onChangeUseDefaultMessage = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    if (value) {
      setCustomMessage(data.message);
      updatedData.message = MOCK_DEFAULT_MESSAGE;
    } else {
      updatedData.message = customMessage;
    }
    updateData(updatedData);
  };

  return (
    <>
      <Popup id="resetBankPopup" isOpen={isOpen} toggle={close} unmountOnClose className="modal-xxl">
        <Form
          id="resetBankForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            defaultOnChange: onChange,
            noCards: true,
            title: 'Stwórz planowane resetowanie',
            onSubmit: close,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'resetBankClose',
              },
              {
                text: 'Zapisz',
                type: 'submit',
                color: 'primary',
                id: 'resetBankSubmit',
                permissions: banksBanksPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    layout: LAYOUT_THREE_COLUMNS,
                    formElements: [
                      {
                        id: 'use_date',
                        label: 'Data ostatecznego wykorzystania punktów',
                        type: 'date',
                        validation: ['required'],
                      },
                      {
                        id: 'year',
                        label: 'Rok z którego roku zostaną usunięte punkty',
                        type: 'select',
                        options: [
                          {
                            value: 2020,
                            label: '2020',
                          },
                          {
                            value: 2021,
                            label: '2021',
                          },
                          {
                            value: 2022,
                            label: '2022',
                          },
                        ],
                      },
                      {
                        id: 'visible_from',
                        label: 'Informacja widoczna od',
                        type: 'date',
                      },
                    ],
                  },
                  {
                    component: <strong key="subtitle" className="pb-2">{__('Treść wiadomości')}</strong>,
                  },
                  {
                    id: 'defaultMessage',
                    type: 'boolean',
                    label: 'Domyślna',
                    onChange: onChangeUseDefaultMessage,
                  },
                  {
                    id: 'message',
                    type: 'wysiwyg',
                    props: {
                      disabled: Boolean(data.defaultMessage),
                    },
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

const MOCK_DEFAULT_MESSAGE = 'Dnia {use_date} zostaną usunięte wszystkie punkty z roku {year}';

ResetInfo.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
