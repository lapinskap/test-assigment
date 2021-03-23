import React, { useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../Components/Form';
import { OPERATOR_MANAGEMENT_SERVICE } from '../../../utils/Api';
import DataLoading from '../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import { importTypes } from '../utils';
import useOrganizationUnits from '../../../utils/hooks/company/useOrganizationUnits';
import useEmployeeGroups from '../../../utils/hooks/company/useEmployeeGroups';
import useRentableGroups from '../../../utils/hooks/company/useRentableGroups';
import { getCompaniesOptionsFetchMethod } from '../../../Components/FormElements/Autocomplete/commonFetchMethods';

const listingPath = '/import-sftp';

export default function Edit({ match }) {
  const { id } = match.params;
  const isNew = id === '-1';
  const [data, updateData] = useState(isNew ? { active: false } : null);
  const [originalData, updateOriginalData] = useState(null);
  const history = useHistory();
  const companyId = data?.companyId;

  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, false, !companyId);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const rentableGroups = useRentableGroups(true, 'companyId', companyId, false, !companyId);
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const onChangeCompany = (key, value) => {
    if (value) {
      onChange(key, value);
    } else {
      const updatedData = { ...data };
      updatedData[key] = value;
      updatedData.employee_group = null;
      updatedData.organization_unit = null;
      updatedData.rentable_group = null;
      updateData(updatedData);
    }
  };

  const submit = async () => {
    try {
      // const method = isNew ? 'POST' : 'PUT';
      // const path = isNew ? '/operators' : `/operators/${id}`;
      // await restApiRequest(
      //   OPERATOR_MANAGEMENT_SERVICE,
      //   path,
      //   method,
      //   {
      //     body: data,
      //   },
      //   data,
      // );
      dynamicNotification(__('Pomyślnie zapisano import'));
      if (isNew) {
        history.push(listingPath);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać importu'), 'error');
    }
  };

  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading={isNew ? 'Nowy import SFTP' : `Edycja importu${originalData ? ` (ID: ${originalData.id})` : ''}`}
        breadcrumbs={[{
          title: 'Lista Importów',
          link: listingPath,
        }]}
        pushToHistory={!isNew}
      />
      <DataLoading
        service={OPERATOR_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => {
          updateData(updatedData);
          updateOriginalData(updatedData);
        }}
        isMock
        endpoint="/importSftp/edit"
        isNew={isNew}
      >
        <Form
          id="sftpImportForm"
          data={data || {}}
          config={
            {
              title: isNew ? 'Nowy import' : 'Edycja importu',
              stickyTitle: true,
              buttons: [
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  href: listingPath,
                  id: 'sftpImportFormBack',
                },
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'sftpImportFormSubmit',
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  title: 'Konfiguracja ogólna',
                  formElements: [
                    {
                      id: 'company',
                      label: 'Firma',
                      type: 'asyncAutocomplete',
                      onChange: onChangeCompany,
                      fetchOptions: getCompaniesOptionsFetchMethod(data ? data.company : null),
                    },
                    {
                      id: 'employeeGroup',
                      label: 'Grupy pracownicze',
                      type: 'multiselect',
                      displayCondition: Boolean(data && data.company),
                      options: employeeGroups,
                    },
                    {
                      id: 'organizationUnit',
                      label: 'Jednoski organizacyjne',
                      type: 'multiselect',
                      displayCondition: Boolean(data && data.company),
                      options: organizationUnits,
                    },
                    {
                      id: 'rentableGroup',
                      label: 'Grupy dochodowości',
                      displayCondition: Boolean(data && data.company),
                      type: 'multiselect',
                      options: rentableGroups,
                    },
                    {
                      id: 'cron',
                      label: 'Cykliczność',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'email',
                      label: 'Adresy e-mail',
                      type: 'text',
                      validation: ['required'],
                    },
                  ],
                },
                {
                  title: 'Standard pliku importu',
                  formElements: [
                    {
                      id: 'type',
                      label: 'Typ importu',
                      type: 'select',
                      validation: ['required'],
                      options: importTypes,
                    },
                    {
                      id: 'encoding',
                      label: 'Kodowanie',
                      type: 'select',
                      validation: ['required'],
                      options: [{ value: 'utf-8' }, { value: 'utf-16' }, { value: 'windows-1250' }],
                    },
                    {
                      id: 'separator',
                      label: 'Separator',
                      type: 'select',
                      validation: ['required'],
                      options: [{ label: 'Średnik (;)', value: ';' }, { label: 'Przecinek (,)', value: ',' }],
                    },
                    {
                      id: 'dateFormat',
                      label: 'Format daty',
                      type: 'select',
                      validation: ['required'],
                      options: [{ value: 'yyyy-mm-dd' }, { value: 'dd-mm-yyyy' }, { value: 'ddmmyyyy' }],
                    },
                    {
                      id: 'skipHeaders',
                      label: 'Pomijaj nagłówki',
                      type: 'boolean',
                    },
                    {
                      id: 'skipDuplicates',
                      label: 'Pomijaj duplikaty',
                      type: 'boolean',
                    },
                    {
                      id: 'skipQuotes',
                      label: 'Pomijaj "',
                      type: 'boolean',
                    },
                  ],
                },
                {
                  title: 'Konfiguracja danych dostępowych do serwera',
                  formElements: [
                    {
                      id: 'host',
                      label: 'Host:',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'user',
                      label: 'Użytkownik:',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'password',
                      label: 'Hasło:',
                      type: 'text',
                    },
                    {
                      id: 'filePath',
                      label: 'Ścieżka pliku:',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'key',
                      label: 'Klucz:',
                      type: 'text',
                    },
                    {
                      id: 'keyPassword',
                      label: 'Hasło do klucza:',
                      type: 'text',
                    },
                  ],
                },
              ],
            }
          }
        />
      </DataLoading>
    </CSSTransitionGroup>
  );
}

Edit.propTypes = ({
  match: matchPropTypes.isRequired,
});
