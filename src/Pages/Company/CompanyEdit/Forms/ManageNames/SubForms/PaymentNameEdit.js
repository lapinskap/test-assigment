import React, { useState } from 'react';

import DataTable from '../../../../../../Components/DataTable';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';

export default () => {
  const [data, setData] = useState(mockData);
  return (
    <DataTable
      id="manageNamesListing"
      columns={columns(data, setData)}
      data={data}
      filterable={false}
    />
  );
};

const columns = () => [
  {
    Header: 'Nazwa',
    accessor: 'name',
  },
  {
    Header: 'Widoczny w raportach',
    accessor: 'visible_in_report',
    Cell: (cellInfo) => (
      !cellInfo.row._original.skip_checkbox ? (
        <div className="d-block w-100 text-center">
          <ToggleSwitch />
        </div>
      ) : null
    ),
  },
];

const mockData = [
  {
    name: 'Bank punktów',
    filterable_name: 'Bank punktów',
    table_name: 'Bank punktów',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Online',
    filterable_name: 'Online',
    table_name: 'Online',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Pracodawca',
    filterable_name: 'Pracodawca',
    table_name: 'Pracodawca',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Pracownik',
    filterable_name: 'Pracownik',
    table_name: 'Pracownik',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Przekazanie punktów do banku',
    filterable_name: 'Przekazanie punktów do banku',
    table_name: 'Przekazanie punktów do banku',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Współfinansowane z pracodawcą',
    filterable_name: 'Współfinansowane z pracodawcą',
    table_name: 'Współfinansowane z pracodawcą',
    visible_in_report: false,
  },
  {
    skip_checkbox: true,
    name: 'Współfinansowane z ZFŚS',
    filterable_name: 'Współfinansowane z ZFŚS',
    table_name: 'Współfinansowane z ZFŚS',
    visible_in_report: false,
  },
  {
    name: 'ZFŚS',
    filterable_name: 'ZFŚS',
    table_name: 'ZFŚS',
    visible_in_report: false,
  },
];
