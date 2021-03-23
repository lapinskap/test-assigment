import React, {
  useCallback, useState,
} from 'react';
import { Alert } from 'reactstrap';
import Form from '../../../../../Components/Form';
import MonthlyConfig from './SubForms/MonthlyConfig';
import DataLoading from '../../../../../Components/Loading/dataLoading';

export default function CompanyBanksBlockade() {
  const [data, updateData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  }, [data]);

  return (
    <>
      <Alert color="danger">
        <h3>Prawdopodobnie do usuniecia</h3>
        <div>
          Powinniśmy korzystać z nowych banków punktów
        </div>
      </Alert>
      <DataLoading
        fetchedData={Object.keys(data).length > 0}
        isMock
        updateData={(updatedData) => updateData(updatedData)}
        endpoint="/company/companyBanksBlockade/edit"
      >
        <Form
          id="bankBlockadeCoreForm"
          data={data}
          config={{
            title: 'Blokowanie płatności z banków punktów (PRAWDOPODOBNIE DO USUNIĘCIA)',
            stickyTitle: true,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                onClick: () => {
                },
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                title: 'Zablokuj następujące banki punktów:',
                formElements: [
                  {
                    id: 'singlePointsBanks',
                    dataOldSk: 'singlePointsBanks',
                    label: 'Jednorazowe',
                    type: 'checkbox',
                    options: [
                      { value: 'singlePointsBanks1', label: 'Banki punktów' },
                      { value: 'singlePointsBanks2', label: 'Pracownik - potrącenie z pensji' },
                      { value: 'singlePointsBanks3', label: 'Punkty Travel Planet' },
                    ],
                  },
                ],
              },
              {
                title: 'Blokada dla każdego miesiąca w roku:',
                formElements: [
                  {
                    id: 'defaultMonthsInterval',
                    dataOldSk: 'defaultMonthsInterval',
                    label: '',
                    type: 'numberRange',
                    onChange: onRangeChange,
                    props: {
                      min: 1,
                      max: 31,
                    },
                  },
                ],
              },
              {
                title: 'Konfiguracja blokad indywidualnych w poszczególnych miesiącach',
                formElements: [
                  {
                    component: <MonthlyConfig key="monthly_config" />,
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </>
  );
}
