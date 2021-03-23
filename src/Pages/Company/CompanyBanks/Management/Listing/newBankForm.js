import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Form from '../../../../../Components/Form';
import Popup from '../../../../../Components/Popup/popup';
import { banksBanksPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';

export default function NewBankForm({ close, companyId }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        '/points-banks/create',
        'POST',
        {
          body: {
            pointsBankId: uuid(),
            pointsBankOwnerId: companyId,
            bankNameDocId: data.name,
          },
          returnNull: true,
        },
      );
      dynamicNotification(__('Pomyślnie dodano nowy bank punktów'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać banku punktów'), 'error');
    }
  };

  return (
    <>
      <Popup id="newBankFormPopup" isOpen toggle={() => close()} unmountOnClose>
        <Form
          id="newBankForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: () => close(),
            title: 'Dodaj nowy bank',
            onSubmit: submit,
            buttons: [
              {
                onClick: () => close(),
                text: 'Zamknij',
                color: 'light',
                id: 'newBankFormClose',
              },
              {
                text: 'Zapisz',
                type: 'submit',
                id: 'newBankFormSubmit',
                permissions: banksBanksPermissionWrite,
              },
            ],
            defaultOnChange: onChange,
            noCards: true,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'name',
                    label: 'Nazwa:',
                    type: 'text',
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

NewBankForm.propTypes = {
  close: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
};
