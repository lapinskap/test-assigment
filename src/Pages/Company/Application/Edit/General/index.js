import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Form from '../../../../../Components/Form';
import FormConfig from './formConfig';
import EmployeeGroupConfig from './employeeGroupConfig';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import __ from '../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../utils/Notifications';
import { fileToBase64 } from '../../../../../utils/Parsers/fileToBase64';
import { companyApplicationPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';

export default function General({ setIsEdited, applicationId, companyId }) {
  const [data, updateData] = useState(null);
  const isNew = applicationId === -1;
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        isNew ? '/applications' : `/applications/${applicationId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            companyId,
            name: data.name,
            description: data.description,
            availableFrom: data.availabilityFrom,
            availableTo: data.availabilityTo,
            customIcon: data.customIcon ? await fileToBase64(data.customIcon[0]) : '',
            requireAttachmentFromEmployee: data.requireAttachmentFromEmployee,
            active: data.active,
            formFieldsConfiguration: data.formFieldsConfiguration,
            financingAmountsConfiguration: data.financingAmountsConfiguration,
            financingMethod: data.financingMethod,
            pointsBankId: parseInt(data.pointsBankId, 10),
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano wniosek'));
      setIsEdited(false);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać wniosku'), 'error');
    }
  };
  return (
    <DataLoading
      service={COMPANY_MANAGEMENT_SERVICE}
      fetchedData={isNew || data !== null}
      updateData={(updatedData) => updateData(updatedData)}
      endpoint={`/applications/${applicationId}`}
      mockDataEndpoint="/company/application/edit"
      isNew={isNew}
    >
      <Form
        id="applicationForm"
        data={data || {}}
        config={{
          title: isNew ? 'Tworzenie wniosku' : 'Edycja wniosku',
          stickyTitle: true,
          onSubmit: submit,
          buttons: [
            {
              size: 'lg',
              color: 'primary',
              className: 'mr-2',
              text: 'Zapisz',
              permission: companyApplicationPermissionWrite,
              type: 'submit',
              id: 'companyApplicationSubmit',
            },
            {
              size: 'lg',
              color: 'info',
              className: 'mr-2',
              text: 'Lista wniosków',
              href: `/company/edit/${companyId}/application`,
              id: 'companyApplicationList',
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Dane podstawowe',
              formElements: [
                {
                  id: 'name',
                  label: 'Nazwa wniosku:',
                  type: 'text',
                  translatable: {
                    scope: 'company-management_application_name',
                  },
                },
                {
                  id: 'description',
                  label: 'Opis wniosku:',
                  type: 'wysiwyg',
                  translatable: !isNew ? {
                    code: `company-management_${companyId}_application_${applicationId}_description`,
                    isCms: true,
                  } : null,
                },
                {
                  id: 'availability',
                  label: 'Dostępność',
                  type: 'dateRange',
                  validation: ['rangeRequiredBoth'],
                  onChange: onRangeChange,
                },
                {
                  id: 'customIcon',
                  label: 'Ikona wniosku (JPG, JPEG, PNG):',
                  type: 'file',
                },
                {
                  id: 'requireAttachmentFromEmployee',
                  label: 'Wymagaj załącznika od pracownika',
                  type: 'boolean',
                },
                {
                  id: 'active',
                  label: 'Wniosek aktywny',
                  type: 'boolean',
                },
              ],
            },
            {
              title: 'Konfiguracja formularza',
              tooltip: {
                content: (
                  <>
                    Sekcja poniżej służy do konfiguracji formularza, który będzie uzupełniany przez
                    pracownika składającego wniosek.
                    {' '}
                    <br />
                    Wystarczy wybrać typ pola oraz etykiety, które wyświetlą się obok w zależności od
                    języka pracownika.
                  </>
                ),
              },
              formElements: [
                {
                  component: <FormConfig
                    data={(data && data.formFieldsConfiguration) ? data.formFieldsConfiguration : []}
                    onChange={onChange}
                    key="formFieldsConfiguration"
                  />,
                  validation: ['required'],
                  id: 'formFieldsConfiguration',
                },
              ],
            },
            {
              title: 'Konfiguracja kwoty dofinansowania',
              tooltip: {
                content: (
                  <>
                    Sekcja poniżej służy do konfiguracji kwot dofinansowania w poszczególnych grupach
                    pracowniczych i dochodowości.
                    <br />
                    Musi zostać skonfigurowane dofinansowanie przynajmniej dla jednej grupy pracowniczej
                    i co najmniej jednej grupy dochodowości.
                    <br />
                    Brak przypisania kwoty dofinansowania w grupie skutkuje brakiem dostępu do wniosku w
                    danej grupie.
                    <br />
                    Konfiguracja dla wszystkich grup nadpisze konfiguracje w poszczególnych grupach
                    dochodowości.
                    <br />
                    Możesz tworzyć nowe sekcje dla grup pracowniczych za pomocą przycisku plus i usuwać
                    sekcje za pomocą krzyżyka.
                  </>
                ),
              },
              formElements: [
                {
                  component: <EmployeeGroupConfig
                    data={(data && data.financingAmountsConfiguration) ? data.financingAmountsConfiguration : []}
                    companyId={companyId}
                    onChange={onChange}
                    key="financingAmountsConfiguration"
                  />,
                  validation: ['required'],
                  id: 'financingAmountsConfiguration',
                },
              ],
            },
            {
              title: 'Metody dofinansowania',
              tooltip: {
                content: (
                  <>
                    Sekcja poniżej służy do konfiguracji metody dofinansowania. W
                    przypadku wyboru doładowania banku punktów
                    <br />
                    bądź wyboru pracownika należy wskazać bank, który zostanie dofinansowany.
                  </>
                ),
              },
              formElements: [
                {
                  id: 'financingMethod',
                  label: 'Sposób dofinansowania',
                  validation: ['required'],
                  type: 'select',
                  options: [
                    {
                      value: 'transfer',
                      label: 'Przelew',
                    },
                    {
                      value: 'bankPoints',
                      label: 'Doładowanie banku punktów',
                    },
                    {
                      value: 'employeeChoice',
                      label: 'Wybór pracownika',
                    },
                    {
                      value: 'withoutFinancing',
                      label: 'Brak finansowania',
                    },
                  ],
                },
                {
                  id: 'pointsBankId',
                  label: 'Bank punktów',
                  type: 'select',
                  options: [
                    {
                      value: 1,
                      label: 'Bank Punktów ZFSŚ',
                    },
                    {
                      value: 2,
                      label: 'Zgromaczone punky naliczane co miesiąc',
                    },
                  ],
                  displayCondition: data && ['2', '3'].includes(data.financingMethod),
                },
              ],
            },
          ],
        }}
      />
      ;
    </DataLoading>
  );
}

General.propTypes = {
  setIsEdited: PropTypes.func,
  applicationId: PropTypes.number.isRequired,
  companyId: PropTypes.string.isRequired,
};

General.defaultProps = {
  setIsEdited: () => {
  },
};
