import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';
import Form from '../../../../../../../Components/Form';
import __ from '../../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../../utils/Api';

const Resign = ({ subscription, close }) => {
  const [data, setData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    setData({
      blockTo: subscription.blockTo,
      endsAt: new Date(),
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
      id="suspendSubscriptionForm"
      data={data}
      config={{
        isInPopup: true,
        togglePopup: () => close(),
        title: 'Zmiana daty zawieszenia świadczenia',
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
                id: 'endsAt',
                label: 'Rezygnacja od:',
                type: 'month',
              },
              {
                id: 'blockTo',
                label: 'Blokada ponownego wyboru do:',
                type: 'date',
                tooltip: {
                  content: __('Pozostaw puste aby nie blokować ponownego wyboru tego świadczenia.'),
                },
                validation: [{
                  method: 'greaterEqualThanDate',
                  args: [data?.endsAt || 0],
                }],
              },
            ],
          },
        ],
      }}
    />
  );
};

Resign.propTypes = {
  close: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    id: PropTypes.string,
    blockTo: PropTypes.string,
  }).isRequired,
};

export default Resign;
