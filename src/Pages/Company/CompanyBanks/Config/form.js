import React, {
  useCallback, useState,
} from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';

const parseDataToBackend = (data) => {
  const updatedData = { ...data };
  updatedData.payrollYearFrom = parseInt(updatedData.payrollYearFrom, 10);
  return updatedData;
};
// eslint-disable-next-line no-unused-vars
export default function CompanyConfigForm({ companyId }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/companies/${companyId}`,
        'PATCH',
        {
          body: parseDataToBackend(data),
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano dane firmy'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać firmy'), 'error');
    }
  };

  return (
    <DataLoading
      service={COMPANY_MANAGEMENT_SERVICE}
      fetchedData={Object.keys(data).length > 0}
      mockDataEndpoint="/company/companyBanks/edit"
      updateData={(updatedData) => updateData(updatedData)}
      endpoint={`/companies/${companyId}`}
    >
      <Form
        id="companyBankConfigForm"
        data={data}
        submit={submit}
        config={{
          title: 'Konfiguracja banków punktów',
          stickyTitle: true,
          buttons: [
            {
              size: 'lg',
              id: 'companyBanksConfigSubmit',
              color: 'primary',
              className: 'mr-2',
              type: 'submit',
              text: 'Zapisz',
              onClick: () => submit(),
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Składki płacowe',
              formElements: [
                {
                  id: 'payrollYearFrom',
                  dataOldSk: 'cyclicChargeFreq1',
                  label: 'Rok obrachunkowy od:',
                  type: 'select',
                  options: [
                    {
                      value: 1,
                      label: 'stycznia',
                    },
                    {
                      value: 2,
                      label: 'lutego',
                    },
                    {
                      value: 3,
                      label: 'marca',
                    },
                    {
                      value: 4,
                      label: 'kwietnia',
                    },
                    {
                      value: 5,
                      label: 'maja',
                    },
                    {
                      value: 6,
                      label: 'czerwca',
                    },
                    {
                      value: 7,
                      label: 'lipca',
                    },
                    {
                      value: 8,
                      label: 'sierpnia',
                    },
                    {
                      value: 9,
                      label: 'września',
                    },
                    {
                      value: 10,
                      label: 'października',
                    },
                    {
                      value: 11,
                      label: 'listopada',
                    },
                    {
                      value: 12,
                      label: 'grudnia',
                    },
                  ],
                },
                {
                  id: 'payrollNumber',
                  dataOldSk: 'payrollNumber',
                  label: 'Numer składnika płacowego dla punktów:',
                  type: 'text',
                },
                {
                  id: 'separatePayrollNumber',
                  dataOldSk: 'separatePayrollNumbers',
                  label: 'Osobne składniki płacowe dla różnych źródeł finansowania:',
                  type: 'boolean',
                },
                {
                  id: 'twoPayrollNumbers',
                  dataOldSk: 'twoPayrollNumbersForZfss',
                  label: 'Dwa składniki płacowe dla ZFŚS',
                  type: 'boolean',
                },
                {
                  id: 'maximumAmountFirstPayrollNumber',
                  label: 'Maksymalna kwota dla 1 składnika płacowego:',
                  type: 'text',
                  suffix: 'PLN',
                  valueFormatter: 'float',
                  depends: {
                    field: 'twoPayrollNumbersForZfss',
                    value: true,
                  },
                },
                {
                  label: 'Dodatkowe opcje:',
                  type: 'title',
                  props: {
                    withLines: true,
                  },
                },
                {
                  id: 'employeeMessageOneTimeLossPoints',
                  label: 'Nie wyświetlaj pracownikom firmy komunikatu o jednorazowym kasowaniu punktów:',
                  type: 'boolean',
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}
CompanyConfigForm.propTypes = {
  companyId: PropTypes.string.isRequired,
};
