/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';

export default function FormTable({ administrators }) {
  const [data, setData] = useState([]);

  administrators.map((item) => {
    const label = item.label.split(' ');
    const name = label[0];
    const surname = label[1];
    const id = item.value.split('/api/employee-management/v1/rest/employees/').pop();

    return data.push({
      id,
      name,
      surname,
    });
  });

  return (
    <>
      <Label>Przypisani do roli:</Label>
      <DataTable
        id="ahrAdministratorsListing"
        data={data || []}
        filterable
        noCards
        columns={[
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'Imię',
            accessor: 'name',
          },
          {
            Header: 'Nazwisko',
            accessor: 'surname',
          },
        ]}
      />
    </>
  );
}

FormTable.propTypes = {
  administrators: PropTypes.string.isRequired,
};
