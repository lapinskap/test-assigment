import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled from '../../../Components/DataTableControlled';
import { SelectFilter } from '../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';

export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCount(101);
    setData(mockData());
  }, []);

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle heading="Lista firm" />
        <DataTableControlled
          id="standardsListing"
          columns={columns}
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
        />
      </CSSTransitionGroup>
    </>
  );
};

const columnOptions = [
  { value: 1, label: 'Opcja 1' },
  { value: 2, label: 'Opcja 2' },
  { value: 3, label: 'Opcja 3' },
];

const columns = [
  {
    Header: 'Kolumna1',
    accessor: 'column1',
    Filter: SelectFilter(columnOptions, true),
    filterMethod: (filter) => {
      switch (filter.value) {
        default:
          return true;
      }
    },
    Cell: mapValueFromOptions(columnOptions, 'column1'),
    width: 150,
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
    column1: 1,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '2',
    column1: 1,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '3',
    column1: 3,
    column2: 'Kościuszki',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '4',
    column1: 2,
    column2: 'Niepodległości',
    column3: 'Łódź',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '5',
    column1: 2,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'Branża 2',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '6',
    column1: 3,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '7',
    column1: 3,
    column2: 'Poznańska',
    column3: 'Wrocław',
    column4: 'Branża 2',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '8',
    column1: 2,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '9',
    column1: 1,
    column2: 'Warszawska',
    column3: 'Wrocław',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
  {
    id: '10',
    column1: 1,
    column2: 'Długa',
    column3: 'Białystok',
    column4: 'AUTOMOTIVE',
    column5: Math.floor(Math.random() * 100) + 1,
  },
];
