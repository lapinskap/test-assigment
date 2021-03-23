import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../../Components/DataTable';
import Form from './form';
import { DateFilter, dateFilterMethod } from '../../../../../../../Components/DataTable/filters';
import { getDateCell } from '../../../../../../../Components/DataTable/commonCells';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';

export default function PeriodicChargeUpList({ companyId }) {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <DataTable
        id="periodicChargeUpListing"
        noCards
        columns={columns}
        data={mockData}
        showPagination={false}
        filterable
        buttons={[
          {
            onClick: () => {
              setOpenNewForm(true);
            },
            text: '+ Dodaj doładowanie',
            id: 'periodicChargeUpSubmit',
            color: 'primary',
          },
        ]}
      />
      {openNewForm ? <Form close={closeForm} isOpen={Boolean(openNewForm)} companyId={companyId} /> : null}
    </>
  );
}

const columns = [
  {
    Header: 'Rozpocznij od',
    accessor: 'start_from',
    maxWidth: 250,
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('start_from'),
  },
  {
    Header: 'Dzień',
    accessor: 'day',
  },
  {
    Header: 'Status operacji',
    accessor: 'operation_status',
  },
  {
    Header: 'Opis',
    accessor: 'description',
  },
  {
    Header: 'Miesiące',
    accessor: 'months',
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
              id: 'periodicChargeUpPreview',
              color: 'link',
              label: 'Podgląd',
            },
            {
              id: 'periodicChargeUpDelete',
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
    start_from: '08-2020',
    day: 1,
    operation_status: 'Oczekujące',
    description: 'test',
    months: 'Kwiecień, Sierpień, Grudzień',
  },
];

PeriodicChargeUpList.propTypes = {
  companyId: PropTypes.string.isRequired,
};
