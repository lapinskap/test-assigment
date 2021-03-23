import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Form from '../../../../../../../Components/Form';
import Popup from '../../../../../../../Components/Popup/popup';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function OneTimeChargeUpForm({ isOpen, close }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  return (
    <>
      <Popup id="oneTimeChargeUpPopup" isOpen={isOpen} toggle={close} unmountOnClose>
        <Form
          id="oneTimeChargeUpForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: 'Dodaj doładowanie',
            onSubmit: close,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'oneTimeChargeUpFormClose',
              },
              {
                text: 'Zapisz',
                type: 'submit',
                color: 'primary',
                id: 'oneTimeChargeUpFormSubmit',
                permissions: banksBanksPermissionWrite,
              },
            ],
            defaultOnChange: onChange,
            noCards: true,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'file',
                    label: 'Plik CSV',
                    type: 'file',
                    tooltip: {
                      type: 'info',
                      content: (
                        <>
                          Prawidłowy plik powinien zawierać rekordy
                          {' '}
                          <br />
                          w których pierwsza kolumna to nr fk,
                          {' '}
                          <br />
                          druga to liczba punktów. Kolumny powinny
                          {' '}
                          <br />
                          być odseparowane średnikiem.
                        </>
                      ),
                    },
                  },
                  {
                    id: 'release_date',
                    label: 'Data wydania',
                    type: 'date',
                    showTimeSelect: true,
                  },
                  {
                    id: 'description',
                    label: 'Opis',
                    type: 'text',
                    placeholder: 'Maksymalnie 255 znaków',
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

OneTimeChargeUpForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
