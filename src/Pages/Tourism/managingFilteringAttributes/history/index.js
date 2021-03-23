import React, { useState, useCallback } from 'react';
import {
  Input, CardBody, Card,
} from 'reactstrap';
import DataTableControlled from '../../../../Components/DataTableControlled';
import { SelectFilter, DateFilter, dateFilterMethod } from '../../../../Components/DataTable/filters';
import HistoryPreview from './preview';
import { getDateCell, mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import ActionColumn from '../../../../Components/DataTable/actionColumn';

export default function History() {
  const [data, setData] = useState(mockData);
  const [count, setCount] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [isBeingRestored, setIsBeingRestored] = useState(false);
  const closeForm = useCallback(() => {
    setOpenPopup(false);
  }, [setOpenPopup]);
  const fetchData = useCallback(async () => {
    setData(mockData);
    setCount(mockData.length);
  }, []);

  const columns = () => [
    {
      Header: 'Zaznaczenie',
      accessor: 'checkbox',
      maxWidth: 150,
      Filter: SelectFilter(ObjectOptions, true),
      Cell: () => (
        <div className="d-block w-100 text-center">
          <Input type="checkbox" />
        </div>
      ),
    },
    {
      Header: 'Autor',
      accessor: 'name',
    },
    {
      Header: 'Data',
      accessor: 'date',
      maxWidth: 150,
      Filter: DateFilter(true),
      filterMethod: dateFilterMethod,
      Cell: getDateCell('date', true),
    },
    {
      Header: 'Czego dotyczy',
      accessor: 'benefit',
      Filter: SelectFilter(benefits),
      Cell: mapValueFromOptions(benefits, 'benefit'),
    },
    {
      Header: 'Akcja',
      maxWidth: 200,
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <ActionColumn
            data={rowData.row._original}
            buttons={[
              {
                id: 'historyTablePreview',
                className: 'm-1',
                onClick: () => {
                  setOpenPopup(true);
                  setIsBeingRestored(false);
                },
                color: 'link',
                label: 'Podgląd',
              },
              {
                id: 'historyTableRestore',
                className: 'm-1',
                onClick: () => {
                  setOpenPopup(true);
                  setIsBeingRestored(true);
                },
                color: 'link',
                label: 'Przywróć',
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardBody>
          <DataTableControlled
            id="tourismAttributesHistoryListing"
            columns={columns()}
            data={data}
            count={count}
            noCards
            fetchData={fetchData}
            filterable
          />
        </CardBody>
      </Card>
      { openPopup ? <HistoryPreview close={closeForm} isOpen={openPopup} isBeingRestored={isBeingRestored} /> : null}
    </>
  );
}

export const mockData = () => [
  {
    objectId: '1',
    date: '20-03-2019',
    name: 'Stefan Krasnal',
    benefit: 'Dodanie atrybutu',
    checkbox: false,
  },
  {
    objectId: '2',
    date: '19-07-2020',
    name: 'Stefan Krasnal',
    benefit: 'Dodanie atrybutu',
    checkbox: false,
  },
  {
    objectId: '3',
    date: '20-03-2019',
    name: 'Anonim',
    benefit: 'Dodanie atrybutu',
    checkbox: false,
  },
  {
    objectId: '4',
    date: '20-03-2019',
    name: 'Zbigniew Wodecki',
    benefit: 'Dodanie atrybutu',
    checkbox: false,
  },
  {
    objectId: '5',
    date: '20-03-2019',
    name: 'Stefan Krasnal',
    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
  {
    objectId: '6',
    date: '19-07-2020',
    name: 'Stefan Krasnal',
    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
  {
    objectId: '7',
    date: '20-03-2019',
    name: 'Anna Nowak',
    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
  {
    objectId: '8',
    date: '20-03-2019',
    name: 'Stefan Krasnal',

    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
  {
    objectId: '9',
    date: '20-03-2019',
    name: 'Stefan Krasnal',

    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
  {
    objectId: '10',
    date: '20-03-2019',
    name: 'Anna Nowak',
    benefit: 'Nazwa atrybutu obiektu',
    checkbox: false,
  },
];

const ObjectOptions = [
  { value: 'option1', label: 'Wszystkie' },
  { value: 'option2', label: 'Nowe' },
];

const benefits = [
  { value: 'option1', label: 'Dodanie atrybutu' },
  { value: 'option2', label: 'Nazwa atrybutu obiektu' },
];
