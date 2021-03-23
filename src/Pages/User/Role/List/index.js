import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { Link } from 'react-router-dom';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { OPERATOR_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import {
  operatorOperatorPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import BusinessIdColumn from '../../../../Components/DataTable/businessIdColumn';

const getUrlToForm = (id) => `/user/role/edit/${id}`;

export default function OperatorList() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      OPERATOR_MANAGEMENT_SERVICE,
      '/operator-roles',
      filters,
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
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
          heading="Lista ról"
          breadcrumbs={[{
            link: '/user',
            title: 'Operatorzy MB',
          }]}
        />
        <DataTableControlled
          id="operatorRolesListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              color: 'primary',
              href: getUrlToForm('-1'),
              text: '+ Dodaj rolę',
              permission: operatorOperatorPermissionWrite,
            },
          ]}
          columns={[
            {
              Header: 'ID',
              accessor: 'id',
              width: 150,
              Cell: BusinessIdColumn,
            },
            {
              Header: 'Ilość użytkowników',
              accessor: 'users',
              filterable: false,
            },
            {
              Header: 'Nazwa',
              accessor: 'name',
            },
            {
              Header: 'Opis',
              accessor: 'description',
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <Link to={getUrlToForm(rowData.row._original.id)}>Edytuj</Link>
                </div>
              ),
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    users: 5,
    name: 'Admini',
    description: 'Grupa operatorów trzymających władzę',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    users: 17,
    name: 'Importy',
    description: 'import CMS i zgrupowanych',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    users: 10,
    name: 'eCommerce - UX/UI',
    description: 'eCommerce - UX/UI',
  },
];
