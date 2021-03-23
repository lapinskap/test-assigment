import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import DataTable from '../../../../../Components/DataTable';
import { booleanOptions, SelectFilter } from '../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import {
  employeeEmployeeGroupPermissionRead,
  employeeEmployeeGroupPermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../../../Components/DataTableControlled/exportButton';

export default function List({ match }) {
  const history = useHistory();
  const [data, setData] = useState(null);
  const companyName = useCompanyName();

  const { companyId } = match.params;
  const getFormUrl = (id) => `/company/edit/${companyId}/employee-management/employee-groups/${id}`;
  const exportContext = new ExportContext(
    {
      service: EMPLOYEE_MANAGEMENT_SERVICE,
      path: '/employee-groups/export/simple',
      permission: employeeEmployeeGroupPermissionRead,
      fileName: `employee_groups(${companyName})`,
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
          heading={`Lista grup pracowniczych dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista grup pracowniczych"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/employee-management` },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <DataLoading
          service={EMPLOYEE_MANAGEMENT_SERVICE}
          fetchedData={data !== null}
          updateData={(updatedData) => setData(updatedData)}
          endpoint={`/employee-groups?companyId=${companyId}&withCount=true&itemsPerPage=10000`}
          mockDataEndpoint="/company/employeeGroups/list"
        >
          <DataTable
            id="employeeGroupsListing"
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
                id: 'employeeGroupsListingAdd',
                text: '+ Dodaj grupę',
                permission: employeeEmployeeGroupPermissionWrite,
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
                accessor: 'name',
              },
              {
                Header: 'Aktywny',
                accessor: 'active',
                Filter: SelectFilter(booleanOptions),
                Cell: mapValueFromOptions(booleanOptions, 'active'),
              },
              {
                Header: 'Liczba pracowników',
                accessor: 'employeeCount',
                filterable: false,
                maxWidth: 200,
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
