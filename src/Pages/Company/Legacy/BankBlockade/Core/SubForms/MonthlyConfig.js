import React, { useState } from 'react';

import { Input } from 'reactstrap';
import DataTable from '../../../../../../Components/DataTable';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';

export default () => {
  const [data, setData] = useState(mockData);
  return (
    <DataTable
      id="legacyListing"
      columns={columns(data, setData)}
      data={data}
      filterable={false}
      defaultPageSize={12}
    />
  );
};

const columns = (data, updateData) => [
  {
    Header: 'Miesiąc',
    accessor: 'month',
  },
  {
    Header: 'Aktywna',
    accessor: 'active',
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <ToggleSwitch
          checked={cellInfo.row.active}
          disabed={cellInfo.row.individual_configuration}
          handleChange={(value) => {
            const rowData = data.find((item) => item.id === cellInfo.row._original.id);
            if (rowData) {
              rowData.active = value;
              if (value === false) {
                rowData.individual_configuration = false;
              }
              updateData([...data]);
            }
          }}
        />
      </div>
    ),
  },
  {
    Header: 'Konf. indywidualna',
    accessor: 'individual_configuration',
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <ToggleSwitch
          checked={cellInfo.row.individual_configuration}
          disabed={!cellInfo.row.active}
          handleChange={(value) => {
            const rowData = data.find((item) => item.id === cellInfo.row._original.id);
            if (rowData) {
              rowData.individual_configuration = value;
              if (value === true) {
                rowData.active = true;
              }
              updateData([...data]);
            }
          }}
        />
      </div>
    ),
  },
  {
    Header: 'Blokada aktywna od dn. miesiąca',
    accessor: 'blockade_active_from',
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <Input
          type="number"
          min="1"
          max="31"
          disabled={!cellInfo.row.individual_configuration}
          value={cellInfo.row.blockade_active_from}
          onChange={(e) => {
            const rowData = data.find((item) => item.id === cellInfo.row._original.id);
            if (rowData) {
              rowData.blockade_active_from = e.target.value;
              updateData([...data]);
            }
          }}
        />
      </div>
    ),
  },
  {
    Header: 'Blokada aktywna do dn. miesiąca',
    accessor: 'blockade_active_to',
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <Input
          type="number"
          min="1"
          max="31"
          disabled={!cellInfo.row.individual_configuration}
          value={cellInfo.row.blockade_active_to}
          onChange={(e) => {
            const rowData = data.find((item) => item.id === cellInfo.row._original.id);
            if (rowData) {
              rowData.blockade_active_to = e.target.value;
              updateData([...data]);
            }
          }}
        />
      </div>
    ),
  },
];

const mockData = [
  {
    id: 1,
    month: 'Styczeń',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 2,
    month: 'Luty',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 3,
    month: 'Marzec',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 4,
    month: 'Kwiecień',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 5,
    month: 'Maj',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 6,
    month: 'Czerwiec',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 7,
    month: 'Lipiec',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 8,
    month: 'Sierpień',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 9,
    month: 'Wrzesień',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 10,
    month: 'Pazdziernik',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 11,
    month: 'Listopad',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
  {
    id: 12,
    month: 'Grudzień',
    active: true,
    individual_configuration: false,
    blockade_active_from: 1,
    blockade_active_to: 7,
  },
];
