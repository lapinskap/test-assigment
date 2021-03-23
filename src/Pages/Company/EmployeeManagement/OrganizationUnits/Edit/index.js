import React, { useCallback, useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import Form from '../../../../../Components/Form';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import useAhrRoles from '../../../../../utils/hooks/company/useAhrRoles';
import useAhrs from '../../../../../utils/hooks/company/useAhrs';
import { employeeOrganizationUnitPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';
import AdministratorsTable from './administratorsTable';
import { IRI_PREFIX } from '../../../../../utils/hooks/company/useOrganizationUnits';

export default function OrganizationUnitForm({
  match,
}) {
  const { companyId, unitId } = match.params;
  const companyName = useCompanyName();
  const listingUrl = `/company/edit/${match.params.companyId}/employee-management/organization-units`;
  const history = useHistory();
  const [data, setData] = useState(null);
  const isNew = unitId === '-1';
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  const ahrRoles = useAhrRoles(true, 'companyId', companyId, true, isNew);
  const unitIri = `${IRI_PREFIX}/${unitId}`;
  const administrators = useAhrs(false, 'administeredOrganizationUnits', unitIri, false, isNew);
  const submit = async () => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/organization-units' : `/organization-units/${unitId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            companyId,
            ...data,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano jednostkę organizacyjną'));
      if (isNew) {
        history.push(listingUrl);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać jednoski organizacyjnej'), 'error');
    }
  };

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading={isNew ? 'Dodaj nową jednostkę organizacyjną' : 'Edytuj jednostkę organizacyjną'}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/employee-management` },
            { title: 'Lista jednostek organizacyjnych', link: listingUrl },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <DataLoading
          fetchedData={isNew || data !== null}
          updateData={(updatedData) => setData(updatedData)}
          mockDataEndpoint="/company/organizationUnits/edit"
          endpoint={`/organization-units/${unitId}`}
          service={EMPLOYEE_MANAGEMENT_SERVICE}
          isNew={isNew}
        >
          <Form
            id="organizationUnitForm"
            data={data || {}}
            config={{
              title: isNew ? 'Dodaj nową jednostkę organizacyjną' : 'Edytuj jednostkę organizacyjną',
              buttons: [
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  permission: employeeOrganizationUnitPermissionWrite,
                  type: 'submit',
                  id: 'organizationUnitFormSubmit',
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  formElements: [
                    {
                      id: 'name',
                      dataOldSk: 'name',
                      label: 'Nazwa:',
                      type: 'text',
                      validation: ['required', { method: 'minLength', args: [3] }],
                      translatable: {
                        scope: 'employee-management_organization-unit_name',
                      },
                    },
                    {
                      id: 'description',
                      dataOldSk: 'description',
                      label: 'Opis:',
                      type: 'textarea',
                    },
                    {
                      type: 'title',
                      label: 'Przypisanie administratorów:',
                      displayCondition: !isNew,
                    },
                    {
                      id: 'administrators',
                      component: <AdministratorsTable ahrRoles={ahrRoles} administrators={administrators} />,
                      displayCondition: !isNew,
                    },
                  ],
                },
              ],
            }}
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}

OrganizationUnitForm.propTypes = {
  match: matchPropTypes.isRequired,
};
