import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';
import Form from '../../../../../../../Components/Form';
import __ from '../../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../../utils/Api';

const Block = ({ subscription, close }) => {
  const [data, setData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    setData({
      blockTo: subscription.blockTo,
    });
  }, [subscription]);

  const submit = async () => {
    try {
      const { id } = subscription;
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${id}/resign`,
        'POST',
        {
          body: data,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zrezygnowano ze świadczenia.'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się zrezygnować ze świadczenia.'), 'error');
    }
  };
  return (
    <Form
      id="blockSubscriptionForm"
      data={data}
      config={{
        isInPopup: true,
        togglePopup: () => close(),
        title: 'Zmiana daty blokady świadczenia',
        onSubmit: submit,
        buttons: [
          {
            onClick: () => close(),
            text: 'Zamknij',
            color: 'light',
            id: 'resetOneTimeFormClose',
          },
          {
            text: 'Zmień',
            type: 'submit',
            id: 'resetOneTimeFormSubmit',
            permissions: banksBanksPermissionWrite,
          },
        ],
        defaultOnChange: onChange,
        noCards: true,
        formGroups: [
          {
            formElements: [
              {
                id: 'blockTo',
                label: 'Blokada ponownego wyboru do:',
                type: 'date',
                tooltip: {
                  content: __('Pozostaw puste aby nie blokować ponownego wyboru tego świadczenia.'),
                },
              },
            ],
          },
        ],
      }}
    />
  );
};

Block.propTypes = {
  close: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    id: PropTypes.string,
    blockTo: PropTypes.string,
  }).isRequired,
};

export default Block;
