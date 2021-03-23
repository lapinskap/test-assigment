import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../Components/DataTable';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import {
  employeeOrganizationUnitPermissionWrite, employeeRentableGroupPermissionRead,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../../../Components/DataTableControlled/exportButton';
import { useCompanyName } from '../../../CompanyContext';

export default function OrganizationUnits({ companyId }) {
  const [data, setData] = useState(null);
  const companyName = useCompanyName();
  const getFormUrl = (id) => `/company/edit/${companyId}/employee-management/organization-units/${id}`;

  const exportContext = new ExportContext(
    {
      service: EMPLOYEE_MANAGEMENT_SERVICE,
      path: '/organization-units/export/simple',
      permission: employeeRentableGroupPermissionRead,
      fileName: `organization_units(${companyName})`,
      handleAdditionalFilters: () => [
        {
          id: 'companyId',
          value: companyId,
        },
      ],
    },
  );

  return (
    <>
      <DataLoading
        service={EMPLOYEE_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint={`/organization-units?companyId=${companyId}&itemsPerPage=10000`}
        mockDataEndpoint="/company/organizationUnits/list"
      >
        <DataTable
          id="organizationUnitsListing"
          exportContext={exportContext}
          columns={[
            {
              Header: 'ID',
              accessor: 'id',
              width: 150,
              Cell: BusinessIdColumn,
            },
            {
              Header: 'Nazwa',
              accessor: 'name',
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <ActionColumn
                    data={rowData.row._original}
                    buttons={[
                      {
                        id: 'organizationUnitsEdit',
                        className: 'm-1',
                        color: 'link',
                        label: 'Edytuj',
                        href: getFormUrl(rowData.row._original.id),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
          data={data || []}
          filterable
          buttons={[
            {
              permission: employeeOrganizationUnitPermissionWrite,
              href: getFormUrl('-1'),
              text: '+ Dodaj jednostkę',
              color: 'primary',
            },
          ]}
        />
      </DataLoading>
    </>
  );
}

OrganizationUnits.propTypes = {
  companyId: PropTypes.string.isRequired,
};
