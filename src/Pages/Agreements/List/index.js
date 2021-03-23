import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import ToggleSwitch from '../../../Components/FormElements/ToggleSwitch';
import { booleanOptions, SelectFilter, AutocompleteSelectFilter } from '../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import useCompanies from '../../../utils/hooks/company/useCompanies';
import { AGREEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import useAgreementPlacement from '../../../utils/hooks/agreement/useAgreementPlacement';
import { agreementAgreementPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import SecurityWrapper from '../../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';
import ActionColumn from '../../../Components/DataTable/actionColumn';
import BusinessIdColumn from '../../../Components/DataTable/businessIdColumn';

const getUrlToForm = (id) => `/agreements/${id}`;

export default function OperatorList() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const companies = useCompanies(true);
  const employeeGroups = [];
  const placements = useAgreementPlacement(true);
  // eslint-disable-next-line no-unused-vars
  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      AGREEMENT_SERVICE,
      '/agreements',
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
  const toggleActive = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        setData(updatedData);
      }
      await restApiRequest(
        AGREEMENT_SERVICE,
        `/agreements/${id}`,
        'PATCH',
        {
          body: {
            active: value,
          },
        },
        {},
      );
      dynamicNotification(value ? __('Pomyślnie aktywowano zgodę') : __('Pomyślnie dezaktywowano zgodę'));
    } catch (e) {
      console.error(e);
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = !value;
        setData(updatedData);
      }
      dynamicNotification(e.message || __('Nie udało się zmienić aktywności użytkownika'), 'error');
    }
  };

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
          heading="Lista zgód"
          breadcrumbs={[]}
        />
        <DataTableControlled
          id="agreementsListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              color: 'primary',
              href: getUrlToForm(-1),
              text: '+ Dodaj zgodę',
              permission: agreementAgreementPermissionWrite,
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
              Header: 'Tytuł',
              accessor: 'title',
            },
            {
              Header: 'Firma',
              accessor: 'companyId',
              Filter: AutocompleteSelectFilter(companies),
              Cell: mapValueFromOptions(companies, 'companyId'),
            },
            {
              Header: 'Grupy pracownicze',
              accessor: 'employeeGroupIds',
              Filter: SelectFilter(employeeGroups),
              Cell: mapValueFromOptions(employeeGroups, 'employeeGroupIds'),
            },
            {
              Header: 'Lokalizacja',
              accessor: 'placement',
              Filter: SelectFilter(placements),
              Cell: mapValueFromOptions(placements, 'placement'),
            },
            {
              Header: 'Aktywny',
              accessor: 'active',
              filterable: false,
              sortable: false,
              Filter: SelectFilter(booleanOptions),
              Cell: (rowData) => (
                <SecurityWrapper
                  id="agreementsToggleSwitch"
                  permission={agreementAgreementPermissionWrite}
                  disable
                >
                  <ToggleSwitch
                    handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                    checked={rowData.row._original.active}
                  />
                </SecurityWrapper>
              ),
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
                      id: 'agreementsEdit',
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

const mockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    title: 'Testowa zgoda 1',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    employeeGroupIds: 'Pracownicy',
    placement: [2],
    active: true,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    title: 'Testowa zgoda 2',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200027',
    employeeGroupIds: 'Nowi pracownicy',
    placement: [3],
    active: true,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    title: 'Inna testowa zgoda',
    companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200024',
    employeeGroupIds: 'Pracownicy, Nowi pracownicy',
    placement: [1],
    active: false,
  },
];
