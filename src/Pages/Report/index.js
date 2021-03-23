import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
// Pages
import NewReport from './NewReport';
import ReportDetail from './NewReport/ReportsList/Report';
import GeneratedReports from './GeneratedReports';
import Subscriptions from './Subscriptions';
import TilesMenu from '../../Components/TilesMenu';
import ReportsAdHoc from './ReportsAdHoc';
import { MainNav } from '../../Layout/AppNav/NavItems';
import EditSubscription from './Subscriptions/Edit';
import ArchieveDetails from './GeneratedReports/List/Details';
import LandingPage from './LandingPage';
import DiagnosticPage from './DiagnosticPage';
// import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
// import { subscriptionSubscriptionPermissionWrite } from '../../utils/RoleBasedSecurity/permissions';

const Report = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'report').content}
          title="Raporty"
          breadcrumbs={[]}
        />
      )}
    />
    {/* <SecureRoute */}
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/predefined_reports`}
      component={NewReport}
    />
    {/* <SecureRoute */}
    <Route
     // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/predefined_reports/:id`}
      component={ReportDetail}
    />
    {/* <SecureRoute */}
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/archive`}
      component={GeneratedReports}
    />
    <Route
     // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/archive/details/:id`}
      component={ArchieveDetails}
    />
    {/* <SecureRoute */}
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/subscriptions`}
      component={Subscriptions}
    />
    {/* <SecureRoute */}
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      exact
      path={`${match.url}/subscriptions/edit/:id`}
      component={EditSubscription}
    />
    {/* <SecureRoute */}
    <Route
      exact
      // permission={subscriptionSubscriptionPermissionWrite}
      path={`${match.url}/ArchiveLandingPage/:id`}
      component={LandingPage}
    />
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      path={`${match.url}/adhoc_reports`}
      component={ReportsAdHoc}
    />
    <Route
      // permission={subscriptionSubscriptionPermissionWrite}
      path={`${match.url}/diagnosticPage`}
      component={DiagnosticPage}
    />
  </>
);

Report.propTypes = {
  match: matchPropTypes.isRequired,
};
export default Report;
