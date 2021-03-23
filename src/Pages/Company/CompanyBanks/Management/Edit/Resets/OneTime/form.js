import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../../Components/Form';
import Popup from '../../../../../../../Components/Popup/popup';
import useCompanyGroupsOptions from '../../../../../../../utils/hooks/company/useCompanyGroupsOptions';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function OneTimeForm({ isOpen, close, companyId }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const companyOptions = useCompanyGroupsOptions(companyId, true, true, true, true);

  return (
    <>
      <Popup id="resetOneTimePopup" isOpen={isOpen} toggle={close} unmountOnClose>
        <Form
          id="resetOneTimeForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: 'Dodaj resetowanie jednorazowe',
            onSubmit: close,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'resetOneTimeFormClose',
              },
              {
                text: 'Zapisz',
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
                    id: 'group',
                    label: 'Grupa',
                    type: 'autocomplete',
                    options: companyOptions,
                  },
                  {
                    id: 'reset_date',
                    label: 'Data wydania',
                    type: 'date',
                    showTimeSelect: true,
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
OneTimeForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  companyId: PropTypes.string.isRequired,
};
