import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import PropTypes from 'prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { DateFilter, IntIdFilter } from '../../../../Components/DataTable/filters';
import { getDateCell, mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import { NOTIFICATION_SERVICE } from '../../../../utils/Api';
import {
  notificationAppMessagePermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../Components/DataTable/actionColumn';
import {
  getReceiverScope,
  RECEIVER_SCOPE_ALL,
  RECEIVER_SCOPE_COMPANY, RECEIVER_SCOPE_EMPLOYEE,
  RECEIVER_SCOPE_EMPLOYEE_GROUP,
} from '../Edit/edit';
import __ from '../../../../utils/Translations';
import DefaultTooltip from '../../../../Components/Tooltips/defaultTooltip';
import useOperators from '../../../../utils/hooks/operator/useOperators';
import useCompanies from '../../../../utils/hooks/company/useCompanies';
import useAhrs from '../../../../utils/hooks/company/useAhrs';
import useEmployees from '../../../../utils/hooks/company/useEmployees';
import useEmployeeGroups from '../../../../utils/hooks/company/useEmployeeGroups';

export default function AppMessagesList({
  company, companyScope, getUrlToForm, breadcrumbs,
}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [createdByIds, setCreatedByIds] = useState([]);
  const [companyIds, setCompanyIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [employeeGroupIds, setEmployeeGroupIds] = useState([]);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const requestFilters = [...filters];
    if (companyScope) {
      requestFilters.push({ id: 'companyId', value: company });
    }
    const { data: newData, count: newCount } = await getListingData(
      NOTIFICATION_SERVICE,
      '/app-messages',
      requestFilters,
      page,
      pageSize,
      sort,
      {
        dateFilters: ['visibleFrom', 'createdAt'],
      },
      mockData,
    );
    setData(newData.map((el) => ({
      ...el,
      receiverScope: getReceiverScope(el),
      receiver: el.employeeId || el.employeeGroupId || el.companyId,
    })));
    setCount(newCount);
    const companies = [];
    const employeeGroups = [];
    const employees = [];
    const authors = [];
    newData.forEach(({
      companyId, employeeId, employeeGroupId, createdBy,
    }) => {
      if (companyId) {
        companies.push(companyId);
      }
      if (employeeId) {
        employees.push(employeeId);
      }
      if (employeeGroupId) {
        employeeGroups.push(employeeGroupId);
      }
      if (createdBy) {
        authors.push(createdBy);
      }
    });
    if (!companyScope) {
      setCompanyIds(companies);
    }
    setEmployeeGroupIds(employeeGroups);
    setEmployeeIds(employees);
    setCreatedByIds(authors);
  }, [companyScope, company]);

  const operators = useOperators(true, 'id', createdByIds, false, !createdByIds.length);
  const ahrs = useAhrs(true, 'id', createdByIds, false, !createdByIds.length);
  const companies = useCompanies(true, 'id', companyIds, false, !companyIds.length);
  const employeeGroups = useEmployeeGroups(true, 'id', employeeGroupIds, false, !employeeGroupIds.length);
  const employees = useEmployees(true, 'id', employeeIds, false, !employeeIds.length);

  const createdByOptions = [
    ...operators,
    ...ahrs,
  ];
  const receiverOptions = [
    ...companies,
    ...employeeGroups,
    ...employees,
  ];

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
          heading="Lista wiadomości wewnątrzsystemowych"
          breadcrumbs={breadcrumbs}
        />
        <DataTableControlled
          id="agreementsListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              id: 'addAppMessage',
              color: 'primary',
              href: getUrlToForm(-1),
              text: '+ Dodaj wiadomość',
              permission: notificationAppMessagePermissionWrite,
            },
          ]}
          columns={[
            {
              Header: 'ID',
              accessor: 'id',
              Filter: IntIdFilter,
            },
            {
              Header: 'Zakres',
              accessor: 'receiverScope',
              filterable: false,
              Cell: mapValueFromOptions(receiverScopeOptions, 'receiverScope'),
            },
            {
              Header: (
                <>
                  {__('Odbiorca')}
                  {' '}
                  <DefaultTooltip
                    id="filter-tooltip-receiver"
                    content={__('Aby filtrować wpisz id firmy, grupy pracowniczej lub pracownika')}
                  />
                </>
              ),
              accessor: 'receiver',
              Cell: mapValueFromOptions(receiverOptions, 'receiver'),
            },
            {
              Header: (
                <>
                  {__('Zlecający')}
                  {' '}
                  <DefaultTooltip
                    id="filter-tooltip-created-by"
                    content={__('Aby filtrować wpisz id operatora lub ahr\'a')}
                  />
                </>
              ),
              accessor: 'createdBy',
              Cell: mapValueFromOptions(createdByOptions, 'createdBy'),

            },
            {
              Header: 'Tytuł',
              accessor: 'subject',
            },
            {
              Header: 'Zawartość',
              accessor: 'message',
              filterable: false,
              Cell: (cellData) => {
                let value = cellData.row._original[cellData.column.id];
                if (value) {
                  value = value.replace(/(<([^>]+)>)/gi, '');
                }
                if (value && value.length > 258) {
                  value = `${value.slice(0, 255)}...`;
                }
                return value;
              },
            },
            {
              Header: 'Wyświetlaj od',
              accessor: 'visibleFrom',
              Filter: DateFilter(true),
              Cell: getDateCell('visibleFrom', true),
            },
            {
              Header: 'Data utworzenia',
              accessor: 'createdAt',
              Filter: DateFilter(true),
              Cell: getDateCell('createdAt', true),
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <ActionColumn
                  data={rowData.row._original}
                  buttons={[
                    {
                      id: 'appMessageEdit',
                      label: 'Edytuj',
                      href: getUrlToForm(rowData.row._original.id),
                    },

                  ]}
                />
              ),
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

const receiverScopeOptions = [
  { value: RECEIVER_SCOPE_ALL, label: 'Wszyscy' },
  { value: RECEIVER_SCOPE_COMPANY, label: 'Firma' },
  { value: RECEIVER_SCOPE_EMPLOYEE_GROUP, label: 'Grupa pracownicza' },
  { value: RECEIVER_SCOPE_EMPLOYEE, label: 'Pracownik' },
];

const mockData = [
  {
    companyId: 'Firma 1',
    createdAt: '2020-12-17T10:44:00+00:00',
    createdBy: 'Administrator 1',
    id: 1,
    subject: 'Ważna wiadomość',
    message: 'On the other hand, we denounce with righteous indignation and dislike men who are so...',
    visibleFrom: '2020-12-17T10:44:00+00:00',
  },
  {
    employeeId: 'Jan Kowlaski',
    createdAt: '2020-12-17T10:44:00+00:00',
    createdBy: 'Administrator 2',
    id: 2,
    subject: 'Pilne powiadomienie',
    message: 'On the other hand, we denounce with righteous indignation and dislike men who are so...',
    visibleFrom: '2020-12-17T10:44:00+00:00',
  },
  {
    employeeGroupId: 'Nowi użytkownicy',
    createdAt: '2020-12-17T10:44:00+00:00',
    createdBy: 'Administrator 2',
    id: 3,
    subject: 'Witaj w serwisie!',
    message: 'On the other hand, we denounce with righteous indignation and dislike men who are so...',
    visibleFrom: '2020-12-17T10:44:00+00:00',
  },
];
AppMessagesList.propTypes = ({
  company: PropTypes.string,
  companyScope: PropTypes.bool,
  getUrlToForm: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
});
AppMessagesList.defaultProps = ({
  company: null,
  companyScope: false,
});
