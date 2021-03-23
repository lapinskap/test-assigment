import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';
import Form from '../../../../../../../Components/Form';
import __ from '../../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../../utils/Api';

const Cancel = ({ subscription, close }) => {
  const submit = async () => {
    try {
      const { id } = subscription;
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${id}/cancel`,
        'POST',
        {
          returnNull: true,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie anulowano świadczenie.'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się anulować świadczenia.'), 'error');
    }
  };
  return (
    <Form
      id="cancelSubscriptionForm"
      data={{}}
      config={{
        isInPopup: true,
        togglePopup: () => close(),
        title: 'Anulacja świadczenia abonamentowego',
        onSubmit: submit,
        buttons: [
          {
            onClick: () => close(),
            text: 'Zamknij',
            color: 'light',
            id: 'resetOneTimeFormClose',
          },
          {
            text: 'Anulacja świadczenia abonamentowego',
            type: 'submit',
            id: 'resetOneTimeFormSubmit',
            permissions: banksBanksPermissionWrite,
          },
        ],
        defaultOnChange: () => {},
        noCards: true,
        formGroups: [
          {
            formElements: [
              {
                component: Info,
              },
            ],
          },
        ],
      }}
    />
  );
};

Cancel.propTypes = {
  close: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

const Info = (
  <Alert key="cancelInfo" color="primary">
    <h4>{__('Uwaga: Anulacja świadczenia jest nieodwracalna.')}</h4>
    <p>
      {__('Konsekwencje anulowania świadczenia')}
      :
    </p>
    <ul>
      <li>{__('data startu świadczenia równa dacie końca świadczenia P = R')}</li>
      <li>
        {__(
          // eslint-disable-next-line max-len
          'kwota w świadczeniu: Przekazanie punktów do banku punktów nie jest korygowana automatycznie. Operator musi zmienić tę kwotę sam',
        )}
      </li>
      <li>
        {__(
          // eslint-disable-next-line max-len
          'liczba punktów w banku punktów nie jest korygowana. Po anulacji świadczenia operator musi poprawić liczbę punktów w banku (np. jeżeli świadczenie anulowane trwało rok, to musi policzyć ile tych punktów powinien dodać',
        )}
      </li>
    </ul>
  </Alert>
);

export default Cancel;
