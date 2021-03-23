import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { Link } from 'react-router-dom';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../utils/Api';
import { booleanOptions, SelectFilter } from '../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import useCompanies from '../../../utils/hooks/company/useCompanies';
import BusinessIdColumn from '../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';
import { employeeEmployeePermissionRead } from '../../../utils/RoleBasedSecurity/permissions';

export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const companies = useCompanies(true);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees',
      filters,
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
  }, []);

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
        <PageTitle heading="Lista pracowników" breadcrumbs={[{ title: 'Firma', link: '/company' }]} />
        <DataTableControlled
          id="employeesListing"
          exportContext={exportContext}
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
              Header: 'Firma',
              accessor: 'companyId',
              Filter: SelectFilter(companies),
              Cell: mapValueFromOptions(companies, 'companyId'),
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
              filterable: false,
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-50 text-center">
                  <Link
                    to={`/company/edit/${rowData.row._original.companyId}/employee-management/employees/${rowData.row._original.id}`}
                  >
                    Edytuj
                  </Link>
                </div>
              ),
            },
          ]}
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
        />
      </CSSTransitionGroup>
    </>
  );
};

const exportContext = new ExportContext(
  {
    service: EMPLOYEE_MANAGEMENT_SERVICE,
    path: '/employees/export/simple',
    permission: employeeEmployeePermissionRead,
    fileName: 'employees',
  },
);

const mockData = () => [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    firstName: 'Jan',
    lastName: 'Kowalski',
    companyId: 1,
    username: '10clouds344222281',
    email: 'jan.kowalski@gmial.com',
    active: 'Tak',
    employeeGroup: 'Użytkownicy',
    fk: '3c3275af-7247-470e-9397-d114957deb71',
  },
];
