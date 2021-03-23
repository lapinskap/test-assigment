import React from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../../Components/DataTable';
import { SelectFilter } from '../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';

export default function AdministratorsTable({ administrators, ahrRoles }) {
  return (
    <div className="my-3">
      <Label>Dostępni administratorzy:</Label>
      <DataTable
        id="ahrAdministratorsListing"
        data={administrators || []}
        filterable
        noCards
        columns={[
          {
            Header: 'ID',
            accessor: 'id',
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
            Filter: SelectFilter(ahrRoles, false),
            Cell: mapValueFromOptions(ahrRoles, 'ahrRole'),
          },
        ]}
      />
    </div>
  );
}

AdministratorsTable.propTypes = {
  administrators: PropTypes.arrayOf.isRequired,
  ahrRoles: PropTypes.arrayOf.isRequired,
};
