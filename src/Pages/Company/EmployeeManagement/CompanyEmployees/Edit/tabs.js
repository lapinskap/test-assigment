import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import General from './General';
import Subscriptions from './Subscriptions';
import Permission from './Permission';
import Vacations from './Vacations';
import Points from './Points';
import ChargeUps from './ChargeUps';
import Financing from './Financing';
import OneTimeServices from './OneTimeServices';
import TabsWithMemory from '../../../../../Components/Tabs/TabsWithMemory';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import {
  employeeAhrRolePermissionRead, employeeEmployeeLeavePermissionRead,
  employeeEmployeePermissionRead,
} from '../../../../../utils/RoleBasedSecurity/permissions';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'general_data';
  return hash.split('/')[0];
};

export default function Tabs({
  breadcrumbs, isAhr, employeeId, companyId, companyName,
}) {
  const [employeeData, setEmployeeData] = useState({});
  const history = useHistory();
  const isNew = employeeId === '-1';

  useEffect(() => {
    if (employeeId && !isNew) {
      restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/employees/${employeeId}`,
        'GET',
        {},
        { firstName: 'Jan', lastName: 'Kowalski' },
      )
        .then((resData) => {
          setEmployeeData(resData);
        })
        .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy pracowników'), 'error'));
    }
  }, [employeeId, isNew]);

  const activeKey = getActiveTab(history.location.hash);
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
          heading={isNew
            ? `Tworzenie nowego pracownika firmy ${companyName}`
            : `Edycja pracownika 
            ${employeeData.firstName || ''} ${employeeData.lastName || ''} (ID: ${employeeId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie nowego pracownika'
            : `Edycja pracownika 
            ${employeeData.firstName || ''} ${employeeData.lastName || ''} (ID: ${employeeId})`}
          breadcrumbs={breadcrumbs}
          pushToHistory={!isNew}
        />
        <div className="mt-1">
          <TabsWithMemory
            activeKey={activeKey}
            defaultActiveKey="general_data"
            tabsConfig={[
              {
                name: 'Dane pracownika',
                key: 'general_data',
                aclKey: employeeEmployeePermissionRead,
                component: <General
                  employeeId={employeeId}
                  isNew={isNew}
                  companyId={companyId}
                  setEmployeeData={setEmployeeData}
                />,
              },
              {
                name: 'Świadczenia pracownika',
                key: 'subscriptions',
                aclKey: employeeEmployeePermissionRead,
                component: <Subscriptions employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
              },
              {
                name: 'Dofinansowania pracownika',
                key: 'financing',
                aclKey: employeeEmployeePermissionRead,
                component: <Financing employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
                display: !isAhr,
              },
              {
                name: 'Uprawnienia',
                key: 'permissions',
                aclKey: employeeAhrRolePermissionRead,
                component: <Permission employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
                display: !isAhr,
              },
              {
                name: 'Urlopy',
                key: 'vacations',
                aclKey: employeeEmployeeLeavePermissionRead,
                component: <Vacations employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
                display: !isAhr,
              },
              {
                name: 'Punkty',
                key: 'points',
                aclKey: employeeEmployeePermissionRead,
                component: <Points employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
              },
              {
                name: 'Doładowania punktów',
                key: 'charge_ups',
                aclKey: employeeEmployeePermissionRead,
                component: <ChargeUps employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
              },
              {
                name: 'Świadczenia jednorazowe',
                key: 'one_time_services',
                aclKey: employeeEmployeePermissionRead,
                component: <OneTimeServices employeeId={employeeId} companyId={companyId} />,
                disabled: isNew,
                display: !isAhr,
              },
            ]}
          />
        </div>
      </CSSTransitionGroup>
    </>
  );
}
Tabs.propTypes = {
  companyId: PropTypes.string.isRequired,
  employeeId: PropTypes.string.isRequired,
  isAhr: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  })).isRequired,
  companyName: PropTypes.string,
};

Tabs.defaultProps = {
  companyName: '',
  isAhr: false,
};
