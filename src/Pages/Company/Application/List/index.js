import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import { useCompanyName } from '../../CompanyContext';
import ToggleSwitch from '../../../../Components/FormElements/ToggleSwitch';
import { SelectFilter, booleanOptions } from '../../../../Components/DataTable/filters';
import { companyApplicationPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../Components/DataTable/actionColumn';

export default function List({ match }) {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const { companyId } = match.params;
  const companyName = useCompanyName();
  const getFormUrl = (id) => `/company/edit/${companyId}/application/${id}`;

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      COMPANY_MANAGEMENT_SERVICE,
      '/applications',
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

  const updateApplication = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        setData(updatedData);
      }
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/applications/${id}`,
        'PATCH',
        {
          body: {
            active: value,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zaktualizowano wniosek'));
    } catch (e) {
      console.error(e);
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        setData(updatedData);
      }
      dynamicNotification(e.message || __('Nie udało się zaktualizować wniosku'), 'error');
    }
  };

  const deleteApplication = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/applications/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto wniosek'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć wniosku'), 'error');
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
          heading={`Lista wniosków dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista wniosków"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <DataTableControlled
          id="applicationsListing"
          columns={columns(getFormUrl, updateApplication, deleteApplication)}
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              onClick: () => {
                history.push(getFormUrl(-1));
              },
              text: '+ Nowy wniosek',
              permission: companyApplicationPermissionWrite,
              id: 'companyApplicationNew',
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

const columns = (getFormUrl, updateApplication, deleteApplication) => [
  {
    Header: 'Nazwa wniosku',
    accessor: 'name',
  },
  {
    Header: 'Aktywny',
    accessor: 'active',
    Filter: SelectFilter(booleanOptions),
    Cell: (rowData) => (
      <div className="d-block w-100 text-center">
        <ToggleSwitch
          handleChange={(isOn) => {
            updateApplication(rowData.row._original.id, isOn);
          }}
          checked={rowData.row._original.active}
        />
      </div>
    ),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (rowData) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={rowData.row._original}
          buttons={[
            {
              id: 'employeeGroupConfigDelete',
              href: getFormUrl(rowData.row._original.id),
              color: 'link',
              label: 'Edytuj',
            },
            {
              id: 'employeeGroupConfigDelete',
              onClick: () => {
                deleteApplication(rowData.row._original.id);
              },
              color: 'link',
              label: 'Usuń',
              permission: companyApplicationPermissionWrite,
            },
          ]}
        />
      </div>
    ),
  },
];

const mockData = () => [
  {
    id: '1',
    name: 'Przykładowy wniosek',
    active: 'Tak',
  },
];
List.propTypes = {
  match: matchPropTypes.isRequired,
};
