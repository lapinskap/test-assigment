import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import Form from '../../../../Components/Form';
import { SSO_SERVICE, restApiRequest } from '../../../../utils/Api';
import Popup from '../../../../Components/Popup/popup';

export default function PasswordPopup({
  isOpen, close, username, operatorId,
}) {
  const [data, updateData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      await restApiRequest(
        SSO_SERVICE,
        '/change-password',
        'POST',
        {
          body: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            userId: operatorId,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zmieniono hasło'));
      close();
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zmienić hasła'), 'error');
    }
  };

  return (

    <Popup id="passwordPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose>
      <Form
        id="passwordForm"
        data={data}
        config={{
          defaultOnChange: onChange,
          isInPopup: true,
          togglePopup: close,
          title: `Zmiana hasła dla użytkownika ${username} (${operatorId})`,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              type: 'submit',
            },
          ],
          onSubmit: submit,
          formGroups: [
            {
              formElements: [
                {
                  id: 'currentPassword',
                  label: 'Twoje obecne hasło',
                  type: 'password',
                  validation: ['required'],
                },
                {
                  id: 'newPassword',
                  label: 'Nowe hasło dla użytkownika',
                  type: 'password',
                  validation: ['required', 'password'],
                },
                {
                  id: 'newPasswordRepeat',
                  label: 'Powtórz nowe hasło',
                  type: 'password',
                  validation: ['required', {
                    method: 'mustBeEqual',
                    args: [data.newPassword, 'Hasła nie są takie same'],
                  }],
                  props: {
                    previewToggle: false,
                  },
                },
              ],
            },
          ],
        }}
      />
    </Popup>
  );
}

PasswordPopup.propTypes = {
  username: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  operatorId: PropTypes.string.isRequired,
};
