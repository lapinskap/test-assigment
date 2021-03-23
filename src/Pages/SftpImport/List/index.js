import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled from '../../../Components/DataTableControlled';
import { SelectFilter } from '../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import { importTypes } from '../utils';
import useCompanies from '../../../utils/hooks/company/useCompanies';

const getUrlToForm = (id) => `/import-sftp/${id}`;

export default function OperatorList() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const companies = useCompanies();

  // eslint-disable-next-line no-unused-vars
  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    // const { data: newData, count: newCount } = await getListingData(
    //   OPERATOR_MANAGEMENT_SERVICE,
    //   '/operators',
    //   filters,
    //   page,
    //   pageSize,
    //   sort,
    //   {},
    //   mockData,
    // );
    setData(mockData);
    setCount(mockData.length);
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
        <PageTitle
          heading="SFTP - Import pracowników"
          breadcrumbs={[{ title: 'Firma', link: '/company' }]}
        />
        <DataTableControlled
          id="sftpImportsListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              color: 'primary',
              href: getUrlToForm('-1'),
              text: '+ Dodaj import',
            },
          ]}
          columns={[
            {
              Header: 'Nazwa firmy',
              accessor: 'companyId',
              Cell: (rowData) => {
                const companyObject = companies.find((company) => company.id === rowData.row._original.companyId);
                return (
                  <div className="d-block w-100 text-center">
                    {companyObject ? companyObject.fullName : ''}
                  </div>
                );
              },
            },
            {
              Header: 'Typ importu',
              accessor: 'type',
              Filter: SelectFilter(importTypes),
              filterMethod: (filter) => {
                switch (filter.value) {
                  default:
                    return true;
                }
              },
              Cell: mapValueFromOptions(importTypes, 'type'),
            },
            {
              Header: 'Cykliczność',
              accessor: 'cron',
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <Link to={getUrlToForm(rowData.row._original.id)}><Button className="link-button" color="link" type="button">Edytuj</Button></Link>
                  <Button className="link-button" color="link" type="button">Usuń</Button>
                </div>
              ),
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

const mockData = [
  {
    companyId: '1',
    type: 1,
    cron: '2 4 * * *',
  },
  {
    companyId: '2',
    type: 2,
    cron: '10 10 * * *',
  },
  {
    companyId: '3',
    type: 1,
    cron: '50 3 5 * *',
  },
];
