import React, { useState } from 'react';
import Form from './form';
import { SelectFilter } from '../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import { ScopeTypes } from '../../utils/fetchScopeOptions';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { TRANSLATOR_SERVICE } from '../../../../utils/Api';
import { translationTranslationScopePermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const closeForm = (withReload = false) => {
    setFormOpen(false);
    if (withReload) {
      setVersion(version + 1);
    }
  };

  const fetchData = async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      TRANSLATOR_SERVICE,
      '/scopes',
      filters,
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
  };

  return (
    <>
      <DataTableControlled
        id="translationScopesListing"
        key={version}
        columns={columns}
        data={data}
        count={count}
        filterable
        buttons={[
          {
            onClick: () => {
              setFormOpen(true);
            },
            permission: translationTranslationScopePermissionWrite,
            text: '+ Dodaj',
            color: 'primary',
          },
        ]}
        fetchData={fetchData}
      />
      {formOpen ? <Form close={closeForm} isOpen={formOpen} /> : null}
    </>
  );
};

const columns = [
  {
    Header: 'Kod',
    accessor: 'code',
  },
  {
    Header: 'Tytuł',
    accessor: 'title',
  },
  {
    Header: 'Typ',
    accessor: 'type',
    Filter: SelectFilter(ScopeTypes, true),
    filterMethod: (filter) => {
      switch (filter.value) {
        default:
          return true;
      }
    },
    Cell: mapValueFromOptions(ScopeTypes, 'type'),
  },
];

const mockData = [
  {
    code: 'omb_interface',
    title: 'OMB Interface',
    type: 1,
  },
  {
    code: 'product',
    title: 'Produkt',
    type: 2,
  },
  {
    code: 'homepage',
    title: 'Strona główna',
    type: 3,
  },
];
