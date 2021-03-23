import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';
import Form from '../../../../../../../Components/Form';
import __ from '../../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../../utils/Api';

const Suspend = ({ subscription, close }) => {
  const [data, setData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    setData({
      suspendedFrom: subscription.suspendedFrom,
      suspendedTo: subscription.suspendedTo,
    });
  }, [subscription]);

  const submit = async () => {
    try {
      const { id } = subscription;
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${id}`,
        'PATCH',
        {
          body: data,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zmieniono daty zawieszeń świadczenia.'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się zmienić świadczenia.'), 'error');
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
                id: 'suspendedFrom',
                label: 'Zawieszenie od:',
                type: 'date',
              },
              {
                id: 'suspendedTo',
                label: 'Zawieszenie do:',
                type: 'date',
                validation: [{
                  method: 'greaterEqualThanDate',
                  args: [data?.suspendedFrom || 0],
                }],
              },
            ],
          },
        ],
      }}
    />
  );
};

Suspend.propTypes = {
  close: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    id: PropTypes.string,
    suspendedFrom: PropTypes.string,
    suspendedTo: PropTypes.string,
  }).isRequired,
};

export default Suspend;
