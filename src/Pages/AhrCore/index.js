import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { AhrMainNav } from '../../Layout/AppNav/NavItems';

// Pages
import CompanyEmployeesList from './CompanyEmployees/List';
import CompanyEmployeesEdit from './CompanyEmployees/Edit';
import PendingBenefits from './BenefitsPending';
import CompanyParty from './CompanyParty';
import AccessToken from './AccessToken';
import Report from './Report';
import TilesMenu from '../../Components/TilesMenu';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import {
  catalogProductPermissionRead,
  employeeEmployeePermissionRead,
  companyTokenPermissionRead, notificationAppMessagePermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';
import { useCompanyName } from '../Company/CompanyContext';
import AppMessagesList from './Notification/AppMessages/List';
import AppMessagesEdit from './Notification/AppMessages/Edit';

const AhrCore = ({ match }) => {
  const companyName = useCompanyName();
  return (
    <>
      <Route
        exact
        path={`${match.url}`}
        render={() => <TilesMenu config={AhrMainNav} title={`Zarządzanie firmą ${companyName}`} breadcrumbs={[]} />}
      />
      <SecureRoute
        permission={employeeEmployeePermissionRead}
        exact
        path={`${match.url}/employees`}
        component={CompanyEmployeesList}
      />
      <SecureRoute
        permission={employeeEmployeePermissionRead}
        exact
        path={`${match.url}/employees/:employeeId`}
        component={CompanyEmployeesEdit}
      />
      <SecureRoute
        permission={catalogProductPermissionRead}
        exact
        path={`${match.url}/pending-benefits`}
        component={PendingBenefits}
      />
      <SecureRoute
        permission={employeeEmployeePermissionRead}
        exact
        path={`${match.url}/company-party`}
        component={CompanyParty}
      />
      <SecureRoute
        permission={companyTokenPermissionRead}
        exact
        path={`${match.url}/access`}
        component={AccessToken}
      />
      <Route path={`${match.url}/report`} component={Report} />
      <Route
        exact
        path={`${match.url}/notification`}
        render={() => (
          <TilesMenu
            config={AhrMainNav.find((el) => el.id === 'notification').content}
            title="Powiadomienia"
            breadcrumbs={[
              {
                title: `Zarządzanie firmą ${companyName}`,
                link: `${match.url}`,
              },
            ]}
          />
        )}
      />
      <SecureRoute
        permission={notificationAppMessagePermissionRead}
        exact
        path={`${match.url}/notification/app-messages`}
        component={AppMessagesList}
      />
      <SecureRoute
        permission={notificationAppMessagePermissionRead}
        exact
        path={`${match.url}/notification/app-messages/:appMessageId`}
        component={AppMessagesEdit}
      />
    </>
  );
};

export default AhrCore;

AhrCore.propTypes = {
  match: matchPropTypes.isRequired,
};
