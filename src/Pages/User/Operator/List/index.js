import React, { useCallback, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { Link } from 'react-router-dom';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { OPERATOR_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import ToggleSwitch from '../../../../Components/FormElements/ToggleSwitch';
import { booleanOptions, SelectFilter } from '../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import useOperatorRoles from '../../../../utils/hooks/operator/useOperatorRoles';
import SecurityWrapper from '../../../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';
import {
  operatorOperatorPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import BusinessIdColumn from '../../../../Components/DataTable/businessIdColumn';

const getUrlToForm = (id) => `/user/operator/edit/${id}`;

export default function OperatorList() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      OPERATOR_MANAGEMENT_SERVICE,
      '/operators',
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

  const groups = useOperatorRoles(true, true);

  const toggleActive = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      setIsActive(false);
      if (item) {
        item.active = value;
        setData(updatedData);
      }
      await restApiRequest(
        OPERATOR_MANAGEMENT_SERVICE,
        `/operators/${id}`,
        'PATCH',
        {
          body: {
            active: value,
          },
        },
        {},
      );
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
    setIsActive(true);
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
          heading="Lista operatorów"
          breadcrumbs={[{ title: 'Operatorzy MB', link: '/user' }]}
        />
        <DataTableControlled
          id="operatorsListing"
          fetchData={fetchData}
          data={data}
          count={count}
          filterable
          buttons={[
            {
              color: 'primary',
              href: getUrlToForm(-1),
              text: '+ Dodaj operatora',
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
              Header: 'Imię',
              accessor: 'firstName',
            },
            {
              Header: 'Nazwisko',
              accessor: 'lastName',
            },
            {
              Header: 'Login',
              accessor: 'username',
            },
            {
              Header: 'E-mail',
              accessor: 'email',
            },
            {
              Header: 'Rola',
              accessor: 'operatorRole',
              Filter: SelectFilter(groups),
              filterMethod: (filter) => {
                switch (filter.value) {
                  default:
                    return true;
                }
              },
              Cell: mapValueFromOptions(groups, 'operatorRole'),
            },
            {
              Header: 'Aktywny',
              accessor: 'active',
              Filter: SelectFilter(booleanOptions),
              filterMethod: (filter) => {
                switch (filter.value) {
                  default:
                    return true;
                }
              },
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <SecurityWrapper disable permission={operatorOperatorPermissionWrite}>
                    <ToggleSwitch
                      handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                      checked={rowData.row._original.active}
                      id={rowData.row._original.id}
                      disabled={!isActive}
                    />
                  </SecurityWrapper>
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
    ssoUuid: 'asd-qwe-zxc-3421',
    firstName: 'Adrian',
    lastName: 'Admin',
    username: 'admin',
    email: 'adrian-admin@mybenefit.pl',
    operatorRole: '1',
    active: true,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    ssoUuid: 'asd-qwe-222-3422',
    firstName: 'Jan',
    lastName: 'Kowal',
    username: 'j.kowal',
    email: 'j.kowal@mybenefit.pl',
    operatorRole: '3',
    active: true,
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    ssoUuid: 'asd-qwe-444-3423',
    firstName: 'John',
    lastName: 'Dow',
    username: 'j.dow',
    email: 'j.dow@mybenefit.pl',
    operatorRole: '2',
    active: false,
  },
];
