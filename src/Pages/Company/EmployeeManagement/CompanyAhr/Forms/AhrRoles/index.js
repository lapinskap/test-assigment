import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';
import DataTable from '../../../../../../Components/DataTable';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
import { employeeAhrRolePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';
import BusinessIdColumn from '../../../../../../Components/DataTable/businessIdColumn';

export default function AhrRoles({ companyId }) {
  const [data, setData] = useState(null);
  const history = useHistory();
  const getFormUrl = (id) => `/company/edit/${companyId}/employee-management/ahr-roles/${id}`;

  return (
    <>
      <DataLoading
        service={EMPLOYEE_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint={`/ahr-roles?companyId=${companyId}&withCount=true&itemsPerPage=10000`}
        mockDataEndpoint="/company/ahrGroups/list"
      >
        <DataTable
          id="ahrRolesListing"
          data={data || []}
          filterable
          buttons={[
            {
              onClick: () => {
                history.push(getFormUrl(-1));
              },
              text: '+ Dodaj rolę',
              permission: employeeAhrRolePermissionWrite,
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
              Header: 'Ilość osób',
              accessor: 'employeeCount',
              filterable: false,
              maxWidth: 100,
            },
            {
              Header: 'Nazwa',
              accessor: 'name',
            },
            {
              Header: 'Opis',
              accessor: 'description',
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => {
                const { id } = rowData.row._original;
                return (
                  <div className="d-block w-100 text-center">
                    <Button className="m-1" color="link" onClick={() => history.push(getFormUrl(id))}>Edytuj</Button>
                  </div>
                );
              },
            },
          ]}
        />
      </DataLoading>
    </>
  );
}

AhrRoles.propTypes = {
  companyId: PropTypes.string.isRequired,
};
