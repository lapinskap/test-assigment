import React, { useState } from 'react';
import DataTable from '../../../../../../../Components/DataTable';
import { getDateCell } from '../../../../../../../Components/DataTable/commonCells';
import { DateFilter, dateFilterMethod } from '../../../../../../../Components/DataTable/filters';
import Form from './form';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';

export default () => {
  const [blockadeId, setBlockadeId] = useState(null);

  const openPopup = (id) => setBlockadeId(id);
  const closePopup = () => setBlockadeId(null);

  return (
    <>
      <DataTable
        id="oneTimeBlockadesListing"
        buttons={[
          {
            onClick: () => openPopup(-1),
            text: '+ Dodaj blokadę jednorazową',
            color: 'primary',
          },
        ]}
        noCards
        columns={columns(openPopup)}
        data={mockData}
        showPagination={false}
        filterable
      />
      {blockadeId ? <Form isOpen={Boolean(blockadeId)} close={closePopup} blockadeId={blockadeId} /> : null}
    </>
  );
};

const columns = (openPopup) => [
  {
    Header: 'Początek blokady',
    accessor: 'blockadeFrom',
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('blockadeFrom'),
  },
  {
    Header: 'Koniec blokady',
    accessor: 'blockadeTo',
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('blockadeTo'),
  },
  {
    Header: 'Wykonawca',
    accessor: 'executor',
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (data) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={data.row._original}
          buttons={[
            {
              id: 'companyBanksBlockadesEdit',
              onClick: () => openPopup(data.row._original.id),
              color: 'link',
              label: 'Edytuj',
            },
            {
              id: 'companyBanksBlockadesDelete',
              color: 'link',
              label: 'Usuń',
            },
          ]}
        />
      </div>
    ),
  },
];

const mockData = [
  {
    id: 1,
    blockadeFrom: '2020-02-02',
    blockadeTo: '2020-07-13',
    executor: 'Jakub Kowal',
  },
  {
    id: 1,
    blockadeFrom: '2020-05-03',
    blockadeTo: '2021-01-01',
    executor: 'Barbara Szymanowska',
  },
];
