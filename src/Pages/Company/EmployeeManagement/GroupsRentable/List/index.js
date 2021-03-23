import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import DataTable from '../../../../../Components/DataTable';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';
import { SelectFilter } from '../../../../../Components/DataTable/filters';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import {
  employeeRentableGroupPermissionRead,
  employeeRentableGroupPermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../../../Components/DataTableControlled/exportButton';

export default function List({ match }) {
  const history = useHistory();
  const [data, setData] = useState(null);

  const { companyId } = match.params;
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

  const getFormUrl = (id) => `/company/edit/${match.params.companyId}/employee-management/rentable-groups/${id}`;
  const companyName = useCompanyName();

  const exportContext = new ExportContext(
    {
      service: EMPLOYEE_MANAGEMENT_SERVICE,
      path: '/rentable-groups/export/simple',
      permission: employeeRentableGroupPermissionRead,
      fileName: `rentable_groups(${companyName})`,
      handleAdditionalFilters: () => [
        {
          id: 'companyId',
          value: companyId,
        },
        {
          id: 'withCount',
          value: 1,
        },
      ],
    },
  );

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
          heading={`Lista grup dochodowości dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista grup dochodowości"
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
          endpoint={`/rentable-groups?companyId=${companyId}&withCount=true&withEmployeeGroups=true&itemsPerPage=10000`}
          mockDataEndpoint="/company/rentableGroup/list"
        >
          <DataTable
            id="rentableGroupsListing"
            data={data || []}
            filterable
            exportContext={exportContext}
            buttons={[
              {
                onClick: () => {
                  history.push(
                    getFormUrl(-1),
                  );
                },
                permission: employeeRentableGroupPermissionWrite,
                text: '+ Dodaj grupę',
                id: 'rentableGroupsListingAdd',
                color: 'primary',
              },
            ]}
            columns={[
              {
                Header: 'ID',
                accessor: 'id',
                width: 150,
                Cell: BusinessIdColumn,
              },
              {
                Header: 'Nazwa grupy',
                accessor: 'frontendName',
              },
              {
                Header: 'Liczba pracowników',
                accessor: 'employeeCount',
                filterable: false,
                maxWidth: 200,
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
                            id: 'employeeGroupsEdit',
                            className: 'm-1',
                            color: 'link',
                            label: 'Edytuj',
                            href: getFormUrl(id),
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
