import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Groups from './subForms/groups';
import Form from '../../../../../../../Components/Form';
import { DateFilter, dateFilterMethod } from '../../../../../../../Components/DataTable/filters';
import { getDateCell } from '../../../../../../../Components/DataTable/commonCells';
import Popup from '../../../../../../../Components/Popup/popup';
import __ from '../../../../../../../utils/Translations';
import useEmployeeGroups from '../../../../../../../utils/hooks/company/useEmployeeGroups';
import useRentableGroups from '../../../../../../../utils/hooks/company/useRentableGroups';
import {
  banksBanksPermissionWrite,
} from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function PeriodicChargeUpForm({ isOpen, close, companyId }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId);
  const rentableGroups = useRentableGroups(true, 'companyId', companyId);

  return (
    <>
      <Popup id="periodicChargeUpPopup" isOpen={isOpen} toggle={close} unmountOnClose size="lg">
        <Form
          id="periodicChargeUpForm"
          data={data}
          config={{
            isInPopup: true,
            onSubmit: close,
            togglePopup: close,
            defaultOnChange: onChange,
            noCards: true,
            buttons: [
              {
                onClick: close,
                text: 'Zamknij',
                color: 'light',
                id: 'periodicChargeUpFormClose',
              },
              {
                size: 'lg',
                color: 'primary',
                text: 'Zapisz',
                permission: banksBanksPermissionWrite,
                type: 'submit',
                id: 'periodicChargeUpFormSubmit',
              },
            ],
            title: __('Dodaj doładowanie'),
            formGroups: [
              {
                formElements: [
                  {
                    id: 'start_from',
                    label: 'Rozpocznij od',
                    Filter: DateFilter(),
                    filterMethod: dateFilterMethod,
                    Cell: getDateCell('start_from'),
                  },
                  {
                    id: 'periodic',
                    label: 'Cykliczność',
                    type: 'select',
                    options: [
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                      { value: 6, label: '6' },
                      { value: 12, label: '12' },
                    ],
                  },
                  {
                    id: 'description',
                    label: 'Opis',
                    type: 'text',
                    placeholder: 'Maksymalnie 255 znaków',
                  },
                  {
                    type: 'hr',
                  },
                  {
                    id: 'employee_groups',
                    label: 'Grupy pracownicze',
                    type: 'boolean',
                    tooltip: {
                      type: 'info',
                      content: (
                        <>
                          Wymagane jest uzupełnienie doładowań dla grup
                          {' '}
                          <br />
                          lub doładowań indywidualnych
                          {' '}
                          <br />
                        </>
                      ),
                    },
                  },
                  {
                    component: <Groups
                      key="employeeGroupsConfig"
                      data={data?.employeeGroupsConfig || []}
                      updateData={(value) => onChange('employeeGroupsConfig', value)}
                      options={employeeGroups}
                    />,
                    depends: {
                      field: 'employee_groups',
                      value: true,
                    },
                  },
                  {
                    id: 'rentable_groups',
                    label: 'Grupy dochodowości',
                    type: 'boolean',
                    tooltip: {
                      type: 'info',
                      content: (
                        <>
                          Wymagane jest uzupełnienie doładowań dla grup
                          {' '}
                          <br />
                          lub doładowań indywidualnych
                          {' '}
                          <br />
                        </>
                      ),
                    },
                  },
                  {
                    component: <Groups
                      key="rentableGroupsConfig"
                      data={data?.rentableGroupsConfig || []}
                      options={rentableGroups}
                      updateData={(value) => onChange('rentableGroupsConfig', value)}
                    />,
                    depends: {
                      field: 'rentable_groups',
                      value: true,
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

PeriodicChargeUpForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  companyId: PropTypes.string.isRequired,
};
