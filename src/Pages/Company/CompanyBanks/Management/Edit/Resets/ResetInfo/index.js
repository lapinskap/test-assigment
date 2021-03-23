import React, { useState, useCallback } from 'react';

import DataTable from '../../../../../../../Components/DataTable';
import Form from './form';
import { getDateCell } from '../../../../../../../Components/DataTable/commonCells';
import { DateFilter, dateFilterMethod } from '../../../../../../../Components/DataTable/filters';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';

export default () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <DataTable
        id="resetInfoListing"
        columns={columns()}
        data={mockData()}
        showPagination={false}
        filterable
        noCards
        buttons={[
          {
            onClick: () => {
              setOpenNewForm(true);
            },
            text: '+ Dodaj',
            id: 'resetInfoAdd',
            color: 'primary',
          },
        ]}
      />
      {openNewForm ? <Form close={closeForm} isOpen={Boolean(openNewForm)} /> : null}
    </>
  );
};

const columns = () => [
  {
    Header: 'Data ostatecznego wykorzystania punktów',
    accessor: 'use_date',
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('use_date'),
  },
  {
    Header: 'Rok z którego roku zostaną usunięte punkty',
    accessor: 'year',
  },
  {
    Header: 'Informacja widoczna od',
    accessor: 'visible_from',
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('visible_from'),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={cellInfo.row._original}
          buttons={[
            {
              id: 'resetInfoDelete',
              color: 'link',
              label: 'Usuń',
            },
          ]}
        />
      </div>
    ),
  },
];

const mockData = () => [
  {
    use_date: '18-06-2020',
    year: '2019',
    visible_from: '17-06-2020',
  },
];
