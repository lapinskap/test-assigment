import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../../Components/DataTable';
import { getDateCell } from '../../../../../../../Components/DataTable/commonCells';
import { DateFilter, dateFilterMethod } from '../../../../../../../Components/DataTable/filters';
import Form from './form';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';

export default function OneTime({ companyId }) {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <DataTable
        id="oneTimeResetListing"
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
            text: '+ Dodaj resetowanie jednorazowe',
            id: 'oneTimeResetAdd',
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
    Header: 'Data resetowania',
    accessor: 'reset_date',
    Filter: DateFilter(),
    filterMethod: dateFilterMethod,
    Cell: getDateCell('reset_date'),
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
              id: 'oneTimeResetsDelete',
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
    reset_date: '16-06-2020 00:00',
    executor: 'Jan Kowalski',
  },
];

OneTime.propTypes = {
  companyId: PropTypes.string.isRequired,
};
