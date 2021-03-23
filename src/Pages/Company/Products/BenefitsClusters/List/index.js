import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Link, useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Button, Alert } from 'reactstrap';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import DataTableControlled from '../../../../../Components/DataTableControlled';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';

export default function List({ match }) {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCount(10);
    setData(mockData());
  }, []);

  const { companyId } = match.params;
  const companyName = useCompanyName();
  return (
    <>
      <Alert color="danger">
        <h3>Zarządzanie funkcjonalnością przeniesione do Magento</h3>
      </Alert>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading={`Lista zgrupowań produktów dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista zgrupowań produktów"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie produktami', link: `/company/edit/${companyId}/products` },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <DataTableControlled
          id="benefitClustersListing"
          columns={columns}
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              onClick: () => {
                history.push(
                  `/company/edit/${companyId}/products/clusters-benefits/-1`,
                );
              },
              text: '+ Dodaj',
              color: 'primary',
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
    width: 150,
    Cell: BusinessIdColumn,
  },
  {
    Header: 'Nazwa benefitu',
    accessor: 'benefit_name',
  },
  {
    Header: 'Nazwa grupy',
    accessor: 'group_name',
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (data) => (
      <div className="d-block w-100 text-center">
        <Link
          to={`/company/edit/${data.row._original.companyId}/products/clusters-benefits/${data.row.id}`}
        >
          Edytuj
        </Link>
        <br />
        <Button type="button" onClick={(e) => e.preventDefault()}>Usuń</Button>
      </div>
    ),
  },
];

const mockData = () => [
  {
    id: '1',
    companyId: '3',
    benefit_name: 'Kultura',
    group_name: 'Pracownicy',
  },
];
List.propTypes = {
  match: matchPropTypes.isRequired,
};
