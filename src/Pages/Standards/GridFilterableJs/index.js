import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled from '../../../Components/DataTable';

export default () => (
  <>
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading="Lista firm"
        subheading="Yet another dashboard built using only the included Architech elements and components."
      />
      <DataTableControlled
        id="standardsListing"
        columns={columns}
        data={mockData()}
        filterable
      />
    </CSSTransitionGroup>
  </>
);

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Kolumna 1',
    accessor: 'column1',
  },
  {
    Header: 'Kolumna 2',
    accessor: 'column2',
  },
  {
    Header: 'Kolumna 3',
    accessor: 'column3',
  },
  {
    Header: 'Kolumna 4',
    accessor: 'column4',
  },
  {
    Header: 'Kolumna 5',
    accessor: 'column5',
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: () => (
      <div className="d-block w-100 text-center">
        <Button color="link">Edytuj</Button>
      </div>
    ),
  },
];

const mockData = () => [
  {
    id: '1',
    column1: 'Firma A',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '2',
    column1: 'Firma B',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '3',
    column1: 'Firma C',
    column2: 'Kościuszki',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '4',
    column1: 'Firma D',
    column2: 'Niepodległości',
    column3: 'Łódź',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '5',
    column1: 'Firma E',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'Branża 2',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '6',
    column1: 'Firma F',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '7',
    column1: 'Firma G',
    column2: 'Poznańska',
    column3: 'Wrocław',
    column4: 'Branża 2',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '8',
    column1: 'Firma H',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '9',
    column1: 'Firma I',
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '10',
    column1: 'Firma J',
    column2: 'Długa',
    column3: 'Białystok',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
];
