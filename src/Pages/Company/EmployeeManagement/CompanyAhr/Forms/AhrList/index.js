import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTableControlled, { getListingData } from '../../../../../../Components/DataTableControlled';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
import useAhrRoles from '../../../../../../utils/hooks/company/useAhrRoles';
import { SelectFilter } from '../../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../../Components/DataTable/commonCells';
import useEmployeeGroups from '../../../../../../utils/hooks/company/useEmployeeGroups';
import useOrganizationUnits from '../../../../../../utils/hooks/company/useOrganizationUnits';
import BusinessIdColumn from '../../../../../../Components/DataTable/businessIdColumn';

export default function AhrList({ companyId }) {
  // const history = useHistory();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const ahrRoles = useAhrRoles(true, 'companyId', companyId, true, !companyId);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);
  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, true, !companyId);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees',
      [
        ...filters,
        {
          id: 'companyId',
          value: companyId,
        },
        {
          id: 'ahr',
          value: true,
        },
      ],
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
  }, [companyId]);

  return (
    <>
      <DataTableControlled
        id="ahrListing"
        fetchData={fetchData}
        data={data}
        count={count}
        filterable
        buttons={[
          // {
          //   onClick: () => {
          //     history.push(
          //       `/company/edit/${companyId}/employee-management/employees/-1`,
          //     );
          //   },
          //   text: '+ Dodaj',
          // },
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
            Header: 'Rola AHR',
            accessor: 'ahrRole',
            Filter: SelectFilter(ahrRoles),
            Cell: mapValueFromOptions(ahrRoles, 'ahrRole'),
          },
          {
            Header: 'Grupy pracownicze',
            accessor: 'administeredEmployeeGroups',
            Filter: SelectFilter(employeeGroups),
            Cell: mapValueFromOptions(employeeGroups, 'administeredEmployeeGroups'),
          },
          {
            Header: 'Jednostki organizacyjne',
            accessor: 'administeredOrganizationUnits',
            Filter: SelectFilter(organizationUnits),
            Cell: mapValueFromOptions(organizationUnits, 'administeredOrganizationUnits'),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            sortable: false,
            filterable: false,
            Cell: (cellData) => (
              <div>
                <div className="d-block w-100 text-center">
                  <Link
                    to={`/company/edit/${cellData.row._original.companyId}/employee-management/employees/${cellData.row.id}#permissions`}
                  >
                    Edytuj
                  </Link>
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    firstName: 'Elżbieta',
    lastName: 'Nowak',
    ahrRole: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    organizationUnits: ['a43275e4-eeb2-11ea-adc1-0242ac1200021'],
    employeeGroups: ['a43275e4-eeb2-11ea-adc1-0242ac1200021'],
    phone: '123 123 123',
  },
];

AhrList.propTypes = {
  companyId: PropTypes.string.isRequired,
};
