import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { employeeEmployeePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';

export default function Points({ active, setIsEdited }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);
  if (!active) {
    return null;
  }

  return (
    <DataLoading
      fetchedData={Object.keys(data).length > 0}
      isMock
      updateData={(updatedData) => updateData(updatedData)}
      endpoint="/employee/points/edit"
    >
      <Form
        id="bankPointsForm"
        data={data}
        config={{
          title: 'Punkty',
          stickyTitle: true,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              permission: employeeEmployeePermissionWrite,
              text: 'Zapisz',
              id: 'bankPointsFormSubmit',
              onClick: () => {
              },
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Systemowe banki punktów',
              formElements: [
                {
                  id: 'individualSubscription',
                  dataOldSk: 'individualSubscription',
                  label: 'Liczba przekazywanych co miesiąc punktów:',
                  type: 'radio',
                  options: [
                    { value: 'individualSubscription1', label: 'z ustawień grupy' },
                    { value: 'individualSubscription2', label: 'ustaw Indywidualnie' },
                  ],
                },
                {
                  id: 'subscriptionAmount',
                  dataOldSk: 'subscriptionAmount',
                  label: 'Ze środków obrotowych:',
                  type: 'number',
                  suffix: 'PLN',
                  depends: {
                    field: 'individualSubscription',
                    value: 'individualSubscription2',
                  },
                },
                {
                  id: 'fitnessAmount',
                  dataOldSk: 'fitnessAmount',
                  label: 'Z ZFŚS:',
                  type: 'number',
                  suffix: 'PLN',
                  depends: {
                    field: 'individualSubscription',
                    value: 'individualSubscription2',
                  },
                },
                {
                  id: 'cyclicTpAmountIndyvidual',
                  dataOldSk: 'cyclicTpAmountIndyvidual',
                  label: 'Cykliczne zasilenie ogólnego banku ZFŚS:',
                  type: 'radio',
                  options: [
                    { value: 'cyclicTpAmountIndyvidual1', label: 'z ustawień grupy' },
                    { value: 'cyclicTpAmountIndyvidual2', label: 'ustaw Indywidualnie' },
                  ],
                },
                {
                  id: 'cyclicTpAmount',
                  dataOldSk: 'cyclicTpAmount',
                  label: 'Kwota:',
                  type: 'select',
                  options: [
                    { value: '0', label: '0.00' },
                    { value: '65', label: '65.00' },
                  ],
                  depends: {
                    field: 'cyclicTpAmountIndyvidual',
                    value: 'cyclicTpAmountIndyvidual2',
                  },
                },
                {
                  id: 'cyclicChargeFreq',
                  dataOldSk: 'cyclicChargeFreq',
                  label: 'Częstotliwość:',
                  type: 'select',
                  options: [
                    { value: '0', label: 'brak' },
                    { value: '1', label: 'co 1 miesiąc' },
                    { value: '3', label: 'co 3 miesiąc' },
                    { value: '6', label: 'co 6 miesiąc' },
                    { value: '12', label: 'co 12 miesiąc' },
                  ],
                  depends: {
                    field: 'cyclicTpAmountIndyvidual',
                    value: 'cyclicTpAmountIndyvidual2',
                  },
                },
                {
                  id: 'updatePointsInput_POINTS_TO_BANK_MANUAL_ADMIN',
                  dataOldSk: 'updatePointsInput_POINTS_TO_BANK_MANUAL_ADMIN',
                  label: 'Zgromadzone punkty (naliczane co miesiąc): miesięczne zasilenie:',
                  type: 'text',
                  valueFormatter: 'float',
                  suffix: 'PLN',
                  tooltip: {
                    content: (
                      <>
                        Wpisz kwotę, która będzie co miesiąc przekazywana do banku punktów tego
                        pracownika.
                      </>
                    ),
                  },
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}

Points.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  employeeId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: PropTypes.string.isRequired,
};
Points.defaultProps = {
  active: false,
  setIsEdited: () => null,
};
