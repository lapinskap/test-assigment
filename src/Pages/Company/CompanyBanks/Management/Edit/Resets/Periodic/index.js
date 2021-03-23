import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../../Components/DataTable';
import Form from './form';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';

export default function PeriodicResets({ companyId }) {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <DataTable
        id="resetsListing"
        columns={columns}
        data={mockData}
        showPagination={false}
        filterable
        noCards
        buttons={[
          {
            onClick: () => {
              setOpenNewForm(true);
            },
            text: '+ Dodaj resetowanie cykliczne',
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
    Header: 'Grupa',
    accessor: 'group',
  },
  {
    Header: 'Miesiące',
    accessor: 'months',
  },
  {
    Header: 'Dzień miesiaca',
    accessor: 'month_day',
  },
  {
    Header: 'Godzina resetu',
    accessor: 'reset_time',
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
    Cell: (cellInfo) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={cellInfo.row._original}
          buttons={[
            {
              id: 'resetsListingDelete',
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
    group: '10clouds',
    months: 'Kwiecień, Sierpień, Grudzień',
    month_day: '7',
    reset_time: '02:30',
    executor: 'Jan Nowak',
  },
];

PeriodicResets.propTypes = {
  companyId: PropTypes.string.isRequired,
};
