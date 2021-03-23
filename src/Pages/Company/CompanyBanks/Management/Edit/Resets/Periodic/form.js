import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../../Components/Form';
import Popup from '../../../../../../../Components/Popup/popup';
import useCompanyGroupsOptions from '../../../../../../../utils/hooks/company/useCompanyGroupsOptions';
import { banksBanksPermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function PeriodicForm({ isOpen, close, companyId }) {
  const [data, updateData] = useState({ months_all: false });

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  const companyOptions = useCompanyGroupsOptions(companyId, true, true, true, true);

  return (
    <>
      <Popup id="periodicResetPopup" isOpen={isOpen} toggle={close} unmountOnClose>
        <Form
          id="periodicResetForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: 'Dodaj resetowanie',
            onSubmit: close,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'periodicResetFormClose',
              },
              {
                text: 'Zapisz',
                type: 'submit',
                id: 'periodicResetFormSubmit',
                permissions: banksBanksPermissionWrite,
              },
            ],
            defaultOnChange: onChange,
            noCards: true,
            formGroups: [
              {
                formElements: [
                  {
                    type: 'title',
                    label: 'Miesiące',
                  },
                  {
                    id: 'months_all',
                    label: 'Wszystkie',
                    type: 'boolean',
                  },
                  {
                    id: 'months',
                    type: 'checkbox',
                    options: [
                      { value: 1, label: 'Styczeń' },
                      { value: 2, label: 'Luty' },
                      { value: 3, label: 'Marzec' },
                      { value: 4, label: 'Kwiecień' },
                      { value: 5, label: 'Maj' },
                      { value: 6, label: 'Czerwiec' },
                      { value: 7, label: 'Lipiec' },
                      { value: 8, label: 'Sierpień' },
                      { value: 9, label: 'Wrzesień' },
                      { value: 10, label: 'Pazdziernik' },
                      { value: 11, label: 'Listopad' },
                      { value: 12, label: 'Grudzień' },
                    ],
                    props: {
                      columns: 3,
                    },
                    depends: {
                      field: 'months_all',
                      value: false,
                    },
                  },
                  {
                    type: 'hr',
                  },
                  {
                    id: 'group',
                    label: 'Grupa',
                    type: 'autocomplete',
                    options: companyOptions,
                  },
                  {
                    id: 'month_day',
                    label: 'Dzień miesiaca',
                    type: 'select',
                    options: [
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                      { value: 5, label: '5' },
                      { value: 6, label: '6' },
                      { value: 7, label: '7' },
                      { value: 8, label: '8' },
                      { value: 9, label: '9' },
                      { value: 10, label: '10' },
                      { value: 11, label: '11' },
                      { value: 12, label: '12' },
                      { value: 13, label: '13' },
                      { value: 14, label: '14' },
                      { value: 15, label: '15' },
                      { value: 16, label: '16' },
                      { value: 17, label: '17' },
                      { value: 18, label: '18' },
                      { value: 19, label: '19' },
                      { value: 20, label: '20' },
                      { value: 21, label: '21' },
                      { value: 22, label: '22' },
                      { value: 23, label: '23' },
                      { value: 24, label: '24' },
                      { value: 25, label: '25' },
                      { value: 26, label: '26' },
                      { value: 27, label: '27' },
                      { value: 28, label: '28' },
                      { value: 29, label: '29' },
                      { value: 30, label: '30' },
                      { value: -1, label: 'ostatni' },
                    ],
                  },
                  {
                    id: 'reset_time',
                    label: 'Godzina resetu',
                    type: 'time',
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
PeriodicForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  companyId: PropTypes.string.isRequired,
};
