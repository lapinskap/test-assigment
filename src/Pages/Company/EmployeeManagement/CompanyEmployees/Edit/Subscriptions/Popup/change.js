import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';
import Form from '../../../../../../../Components/Form';
import __ from '../../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../../utils/Api';

const Change = ({ subscription, close }) => {
  const [data, setData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    setData({
      startsAt: subscription.startsAt,
      endsAt: subscription.endsAt,
    });
  }, [subscription]);

  const submit = async () => {
    try {
      const { id } = subscription;
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${id}/change-dates`,
        'POST',
        {
          body: data,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zmieniono świadczenie.'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się zmienić świadczenia.'), 'error');
    }
  };
  return (
    <Form
      id="changeSubscriptionForm"
      data={data}
      config={{
        isInPopup: true,
        togglePopup: () => close(),
        title: 'Zmiana daty obowiązywania świadczenia',
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
                component: Info,
              },
              {
                id: 'startsAt',
                label: 'Nowa data startu:',
                type: 'month',
                validation: ['required'],
              },
              {
                id: 'endsAt',
                label: 'Nowa data końca:',
                type: 'month',
                validation: [{
                  method: 'greaterEqualThanDate',
                  args: [data?.startsAt || 0],
                }],
              },
            ],
          },
        ],
      }}
    />
  );
};

Change.propTypes = {
  close: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    id: PropTypes.string,
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
  }).isRequired,
};

const Info = (
  <Alert key="cancelInfo" color="primary">
    <h4>{__('UWAGA: Anulacja świadczenia spowoduje zmiany w raporcie płacowym.')}</h4>
    <p>
      {__(
        // eslint-disable-next-line max-len
        'Czy akceptujesz zmiany na swoją odpowiedzialność oraz czy poinformowałeś/aś wszystkie osoby korzystające z raportu płacowego o zmianach (np. AHR firmy)?',
      )}
    </p>
    <ul>
      <li>{__('pusta data końca oznacza świadczenie na czas nieokreślony')}</li>
      <li>
        {__('świadczenia zależne nie przestawiają się automatycznie')}
      </li>
    </ul>
    <p>
      {__('Zmiana dat na świadczeniu Przekazanie Punktów do Banku Punktów powoduje zmianę saldo na koncie użytkownika:')}
    </p>
    <ul>
      <li>{__('wydłużenie świadczenia doładowuje punkty (sprawdź czy doładowana liczba punktów jest prawidłowa)')}</li>
      <li>
        {__(
          // eslint-disable-next-line max-len
          'skrócenie świadczenia odejmuje punkty (sprawdź czy odjęta liczba punktów jest prawidłowa, jeżeli na koncie użytkownika nie ma wystarczającej liczby punktów potrzebnej do skorygowania daty świadczenia, zmiana daty nie jest możliwa)',
        )}
      </li>
    </ul>
  </Alert>
);

export default Change;
