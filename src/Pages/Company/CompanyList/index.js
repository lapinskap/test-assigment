import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import {
  companyCompanyPermissionRead,
  companyCompanyPermissionWrite,
} from '../../../utils/RoleBasedSecurity/permissions';
import { COMPANY_MANAGEMENT_SERVICE, EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import { activeBooleanOptions, SelectFilter } from '../../../Components/DataTable/filters';
import ActionColumn from '../../../Components/DataTable/actionColumn';
// import BusinessIdColumn from '../../../Components/DataTable/businessIdColumn';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';
import arrayUnique from '../../../utils/jsHelpers/arrayUnique';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';

export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const exportContext = new ExportContext(
    {
      service: COMPANY_MANAGEMENT_SERVICE,
      path: '/companies/export/simple',
      permission: companyCompanyPermissionRead,
      fileName: 'companies',
      handleAdditionalFilters,
    },
  );

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const additionalFilters = await handleAdditionalFilters(filters);
    if (additionalFilters === false) {
      setData([]);
      setCount(0);
      return;
    }
    let requestFilters = filters;
    if (additionalFilters.length) {
      requestFilters = [...requestFilters, ...additionalFilters];
    }
    const { data: newData, count: newCount } = await getListingData(
      COMPANY_MANAGEMENT_SERVICE,
      '/companies',
      requestFilters,
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
          heading="Lista firm"
          breadcrumbs={[{ title: 'Firma', link: '/company' }]}
        />
        <DataTableControlled
          id="companiesListing"
          columns={columns}
          exportContext={exportContext}
          fetchData={fetchData}
          buttons={[
            {
              id: 'add',
              color: 'primary',
              href: '/company/list/create',
              text: '+ Dodaj firmę',
              permission: companyCompanyPermissionWrite,
            },
          ]}
          data={data}
          count={count}
          filterable
          additionalFilters={[
            {
              type: 'text',
              id: 'organization_unit',
              label: 'Jednostka organizacyjna',
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};

const columns = [
  // {
  //   Header: 'ID',
  //   accessor: 'id',
  //   width: 150,
  //   Cell: BusinessIdColumn,
  // },
  {
    Header: 'Skrócona nazwa',
    accessor: 'shortName',
  },
  {
    Header: 'Pełna nazwa',
    accessor: 'fullName',
  },
  {
    Header: 'Ulica',
    accessor: 'street',
  },
  {
    Header: 'Miasto',
    accessor: 'city',
  },
  {
    Header: 'Liczba pracowników',
    accessor: 'employeeNumber',
    filterable: false,
    maxWidth: 200,
  },
  {
    Header: 'Status',
    accessor: 'active',
    Filter: SelectFilter(activeBooleanOptions),
    Cell: mapValueFromOptions(activeBooleanOptions, 'active'),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    maxWidth: 150,
    Cell: (data) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={data.row._original}
          buttons={[
            {
              id: 'edit',
              href: `/company/edit/${data.row.id}`,
            },
          ]}
        />
      </div>
    ),
  },
];

const handleAdditionalFilters = async (filters) => {
  const result = [];
  const idsFilter = filters.find(({ id }) => id === 'id');
  if (idsFilter) {
    return result;
  }
  const organizationUnitFilter = filters.find(({ id }) => id === 'organization_unit');
  if (organizationUnitFilter && organizationUnitFilter.value) {
    const organizationUnits = await restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/organization-units',
      'GET',
      {
        params: {
          name: organizationUnitFilter.value,
          itemsPerPage: 10000,
        },
      },
    );
    const ids = organizationUnits.map(({ companyId }) => companyId).filter(arrayUnique);
    if (ids.length) {
      result.push({ id: 'id', value: ids });
    } else {
      return false;
    }
  }

  return result;
};

export const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    fullName: '10clouds',
    shortName: '10clouds',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 76,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    fullName: 'PKO BP',
    shortName: 'PKO BP',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 12,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    fullName: 'Janex',
    shortName: 'Janex',
    street: 'Kościuszki',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 43,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200024',
    fullName: '3m',
    shortName: '3m',
    street: 'Niepodległości',
    city: 'Łódź',
    industry: 'AUTOMOTIVE',
    employeeNumber: 76,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200025',
    fullName: 'AECOM',
    shortName: 'AECOM',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'Branża 2',
    employeeNumber: 87,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200026',
    fullName: 'Allegro',
    shortName: 'Allegro',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 44,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200027',
    fullName: 'Alior bank',
    shortName: 'Alior bank',
    street: 'Poznańska',
    city: 'Wrocław',
    industry: 'Branża 2',
    employeeNumber: 33,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200028',
    fullName: 'Castorama',
    shortName: 'Castorama',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 76,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200029',
    fullName: 'Polfarmex',
    shortName: 'Polfarmex',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employeeNumber: 44,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac12000210',
    fullName: 'Cemex',
    shortName: 'Cemex',
    street: 'Długa',
    city: 'Białystok',
    industry: 'AUTOMOTIVE',
    employeeNumber: 7,
  },
];
