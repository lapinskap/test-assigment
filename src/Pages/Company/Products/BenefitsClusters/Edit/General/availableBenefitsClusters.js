import React from 'react';

import DataTable from '../../../../../../Components/DataTable';
import BusinessIdColumn from '../../../../../../Components/DataTable/businessIdColumn';

export default () => (
  <DataTable
    id="availableBenefitsClusterListing"
    columns={columns()}
    data={mockData}
    filterable
  />
);

const columns = () => [
  {
    Header: 'ID',
    accessor: 'id',
    width: 150,
    Cell: BusinessIdColumn,
  },
  {
    Header: 'Nazwa',
    accessor: 'name',
  },
  {
    Header: 'Link',
    accessor: 'link',
  },
];

const mockData = [
  {
    id: '1',
    name: 'DZIECI',
    link: 'grouped-benefit.html?id=86130577',
  },
  {
    id: '2',
    name: 'INNE',
    link: 'grouped-benefit.html?id=45545654',
  },
  {
    id: '3',
    name: 'KINA',
    link: 'grouped-benefit.html?id=12354436',
  },
  {
    id: '4',
    name: 'DZIECI',
    link: 'grouped-benefit.html?id=86130577',
  },
  {
    id: '5',
    name: 'INNE',
    link: 'grouped-benefit.html?id=45545654',
  },
  {
    id: '6',
    name: 'KINA',
    link: 'grouped-benefit.html?id=12354436',
  },
  {
    id: '7',
    name: 'DZIECI',
    link: 'grouped-benefit.html?id=86130577',
  },
  {
    id: '8',
    name: 'INNE',
    link: 'grouped-benefit.html?id=45545654',
  },
  {
    id: '9',
    name: 'KINA',
    link: 'grouped-benefit.html?id=12354436',
  },
];
