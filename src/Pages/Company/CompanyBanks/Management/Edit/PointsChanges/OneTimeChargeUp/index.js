import React, { useState, useCallback } from 'react';
import { Button } from 'reactstrap';
import DataTable from '../../../../../../../Components/DataTable';
import Form from './form';

export default () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <DataTable
        id="oneTimeChargeUpListing"
        noCards
        columns={columns()}
        data={mockData()}
        showPagination={false}
        filterable
        buttons={[
          {
            onClick: () => {
              setOpenNewForm(true);
            },
            text: '+ Dodaj doładowanie',
            id: 'oneTimeChargeUpAdd',
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
    Header: 'Data wykonania',
    accessor: 'type',
  },
  {
    Header: 'Status operacji',
    accessor: 'document_name_pl',
  },
  {
    Header: 'Opis',
    accessor: 'document_desc_pl',
  },
  {
    Header: 'Plik',
    accessor: 'attachment_pl',
    filterable: false,
    Cell: (data) => (
      <div>
        <a href={data.row.attachment_pl} target="_blank" rel="noopener noreferrer">Pobierz</a>
      </div>
    ),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: () => (
      <div className="d-block w-100 text-center">
        <Button color="link" className="m-1">Usuń</Button>
      </div>
    ),
  },
];

const mockData = () => [];
