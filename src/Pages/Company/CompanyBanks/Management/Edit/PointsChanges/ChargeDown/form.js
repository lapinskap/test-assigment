import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Form from '../../../../../../../Components/Form';
import Popup from '../../../../../../../Components/Popup/popup';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function ChargeDown({ isOpen, close }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  return (
    <>
      <Popup id="chargeDownPopup" isOpen={isOpen} toggle={close} unmountOnClose>
        <Form
          id="chargeDownForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: 'Wykonaj rozładowanie',
            onSubmit: close,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'chargeDownFormClose',
              },
              {
                text: 'Zapisz',
                type: 'submit',
                id: 'chargeDownFormSubmit',
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
                ],
              },
            ],
          }}
        />
      </Popup>
    </>
  );
}

ChargeDown.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
