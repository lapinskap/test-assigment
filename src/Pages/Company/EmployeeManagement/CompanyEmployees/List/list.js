import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../../../Components/DataTableControlled';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { booleanOptions, SelectFilter } from '../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import {
  employeeEmployeePermissionRead,
  employeeEmployeePermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../../../Components/DataTableControlled/exportButton';

export default function List({
  companyId, companyName, breadcrumbs, getEditEmployeeUrl,
}) {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees',
      [...filters, {
        id: 'companyId',
        value: companyId,
      }],
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
  }, [companyId]);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

  const exportContext = new ExportContext(
    {
      service: EMPLOYEE_MANAGEMENT_SERVICE,
      path: '/employees/export/simple',
      permission: employeeEmployeePermissionRead,
      fileName: `employees(${companyName})`,
      handleAdditionalFilters: () => [{
        id: 'companyId',
        value: companyId,
      }],
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
          heading={`Lista pracowników dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista pracowników"
          breadcrumbs={breadcrumbs}
        />
        <DataTableControlled
          id="companyEmployeesListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          exportContext={exportContext}
          buttons={[
            {
              onClick: () => {
                history.push(getEditEmployeeUrl('-1', companyId));
              },
              permission: employeeEmployeePermissionWrite,
              text: '+ Dodaj pracownika',
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
              Header: 'Imię',
              accessor: 'firstName',
            },
            {
              Header: 'Nazwisko',
              accessor: 'lastName',
            },
            {
              Header: 'Login',
              accessor: 'username',
            },
            {
              Header: 'E-mail służbowy',
              accessor: 'businessEmail',
            },
            {
              Header: 'Aktywny',
              accessor: 'active',
              Filter: SelectFilter(booleanOptions),
              Cell: mapValueFromOptions(booleanOptions, 'active'),
            },
            {
              Header: 'Numer pracownika',
              accessor: 'fk',
            },
            {
              Header: 'Grupa pracownicza',
              accessor: 'employeeGroup',
              Filter: SelectFilter(employeeGroups),
              Cell: mapValueFromOptions(employeeGroups, 'employeeGroup'),
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              maxWidth: 100,
              filterable: false,
              sortable: false,
              Cell: (cellData) => (
                <div>
                  <div className="d-block text-center">
                    <ActionColumn
                      data={cellData.row._original}
                      buttons={[
                        {
                          id: 'companEmployeesEdit',
                          href: getEditEmployeeUrl(cellData.row.id, cellData.row._original.companyId),
                          className: 'm-1',
                          color: 'link',
                          label: 'Edytuj',
                        },
                      ]}
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    firstName: 'Jan',
    lastName: 'Kowalski',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    username: '10clouds344222281',
    email: 'jan.kowalski@gmial.com',
    active: true,
    employeeGroup: 'Użytkownicy',
    fk: '3c3275af-7247-470e-9397-d114957deb71',
  },
];

List.propTypes = {
  companyId: PropTypes.string.isRequired,
  getEditEmployeeUrl: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  })).isRequired,
  companyName: PropTypes.string,
};

List.defaultProps = {
  companyName: '',
};
