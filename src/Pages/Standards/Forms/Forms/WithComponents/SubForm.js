import React, { useState } from 'react';

import DataTable from '../../../../../Components/DataTable';
import ToggleSwitch from '../../../../../Components/FormElements/ToggleSwitch';
import { getEditableCell } from '../../../../../Components/DataTable/editableCells';

export default () => {
  const [data, setData] = useState(mockData);
  return (
    <DataTable
      id="standardsListing"
      columns={columns(data, setData)}
      data={data}
      filterable={false}
    />
  );
};

const columns = (data, updateData) => [
  {
    Header: 'Nazwa',
    accessor: 'name',
  },
  {
    Header: 'Nazwa przy filtrowaniu oraz w wierszach',
    accessor: 'filterable_name',
    Cell: getEditableCell(data, updateData),
  },
  {
    Header: 'Nazwa w kolumnach tabelek',
    accessor: 'table_name',
    Cell: getEditableCell(data, updateData),
  },
  {
    Header: 'Widoczny w raportach',
    accessor: 'visible_in_report',
    Cell: () => (
      <div className="d-block w-100 text-center">
        <ToggleSwitch />
      </div>
    ),
  },
];

const mockData = [
  {
    name: 'Wartośc 1',
    filterable_name: 'Wartośc 1',
    table_name: 'Wartośc 1',
    visible_in_report: false,
  },
  {
    name: 'Wartośc 2',
    filterable_name: 'Wartośc 2',
    table_name: 'Wartośc 2',
    visible_in_report: true,
  },
  {
    name: 'Wartośc 3',
    filterable_name: 'Wartośc 3',
    table_name: 'Wartośc 3',
    visible_in_report: false,
  },
];
