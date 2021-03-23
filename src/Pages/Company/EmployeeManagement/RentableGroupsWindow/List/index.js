import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import DataTable from '../../../../../Components/DataTable';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';
import { booleanOptions, SelectFilter } from '../../../../../Components/DataTable/filters';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import {
  employeeRentableGroupSelectionWindowPermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import { windowTypeOptions } from '../utils/consts';
import { clearRentableGroupAssignment } from '../../GroupsRentable/utils';

export default function List({ match }) {
  const history = useHistory();
  const [data, setData] = useState(null);

  const { companyId } = match.params;
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

  const getFormUrl = (id) => `/company/edit/${match.params.companyId}/employee-management/rentable-group-selection-windows/${id}`;
  const companyName = useCompanyName();

  const deleteWindow = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/rentable-group-selection-windows/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto okno wyboru grupy dochodowości.'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć okna wyboru grupy dochodowości.'), 'error');
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
          heading={`Lista okien wyboru grup dochodowości dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista okien wyboru grup dochodowości"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Zarządzanie pracownikami',
              link: `/company/edit/${companyId}/employee-management`,
            },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <DataLoading
          service={EMPLOYEE_MANAGEMENT_SERVICE}
          fetchedData={data !== null}
          updateData={(updatedData) => setData(updatedData)}
          endpoint={`/rentable-group-selection-windows?companyId=${companyId}&itemsPerPage=10000`}
          mockDataEndpoint="/company/rentableGroupSelectionWindow/list"
        >
          <DataTable
            id="rentableGroupSelectionWindowsListing"
            data={data || []}
            filterable
            buttons={[
              {
                size: 'lg',
                color: 'danger',
                className: 'mr-2',
                text: 'Czyszczenie wyboru grupy dochodowości',
                id: 'clearAssignment',
                onClick: () => {
                  getUserConfirmationPopup(
                    // eslint-disable-next-line max-len
                    __('Uwaga! ta zmiana spowoduje usunięcie wszystkich wyborów grup dochodowości przez pracowników należących do firmy {0}.', [companyName]),
                    (confirm) => confirm && clearRentableGroupAssignment(companyId),
                    __('Czy na pewno chcesz usunąć powiązania?'),
                  );
                },
              },
              {
                onClick: () => {
                  history.push(
                    getFormUrl(-1),
                  );
                },
                permission: employeeRentableGroupSelectionWindowPermissionWrite,
                text: '+ Dodaj okno',
                id: 'rentableGroupsListingAdd',
                color: 'primary',
              },
            ]}
            columns={[
              {
                Header: 'Nazwa',
                accessor: 'name',
              },
              {
                Header: 'Rodzaj',
                accessor: 'windowType',
                Filter: SelectFilter(windowTypeOptions),
                Cell: mapValueFromOptions(windowTypeOptions, 'windowType'),
              },
              {
                Header: 'Aktywny',
                accessor: 'active',
                Filter: SelectFilter(booleanOptions),
                Cell: mapValueFromOptions(booleanOptions, 'active'),
              },
              {
                Header: 'Dostępna w grupach',
                accessor: 'employeeGroups',
                Filter: SelectFilter(employeeGroups),
                Cell: mapValueFromOptions(employeeGroups, 'employeeGroups'),
              },
              {
                Header: 'Akcja',
                accessor: 'action',
                filterable: false,
                sortable: false,
                Cell: (cellInfo) => {
                  const { id } = cellInfo.row._original;
                  return (
                    <div className="d-block w-100 text-center">
                      <ActionColumn
                        data={cellInfo.row._original}
                        buttons={[
                          {
                            id: 'rentableGroupSelectionWindowEdit',
                            className: 'm-1',
                            color: 'link',
                            label: 'Edytuj',
                            href: getFormUrl(id),
                          },
                          {
                            id: 'rentableGroupSelectionWindowDelete',
                            className: 'm-1',
                            onClick: () => {
                              getUserConfirmationPopup(
                                __('Czy na pewno chcesz usunąć to okno wyboru?'),
                                (confirm) => confirm && deleteWindow(id),
                                __('Usuwanie okna wyboru grupy dochodowości.'),
                              );
                            },
                            color: 'link',
                            label: 'Usuń',
                            permission: employeeRentableGroupSelectionWindowPermissionWrite,
                          },
                        ]}
                      />
                    </div>
                  );
                },
              },
            ]}
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}

List.propTypes = {
  match: matchPropTypes.isRequired,
};
