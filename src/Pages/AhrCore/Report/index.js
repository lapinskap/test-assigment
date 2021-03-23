import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import { AhrMainNav } from '../../../Layout/AppNav/NavItems';
import TilesMenu from '../../../Components/TilesMenu';
// import SecureRoute from '../../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
// import { subscriptionSubscriptionPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

import NewReport from '../../Report/NewReport';
import ReportDetail from '../../Report/NewReport/ReportsList/Report';
import GeneratedReports from '../../Report/GeneratedReports';
import Subscriptions from '../../Report/Subscriptions';
import ReportsAdHoc from '../../Report/ReportsAdHoc';
import EditSubscription from '../../Report/Subscriptions/Edit';
import ArchieveDetails from '../../Report/GeneratedReports/List/Details';
import LandingPage from '../../Report/LandingPage';
import DiagnosticPage from '../../Report/DiagnosticPage';

const config = AhrMainNav.find((el) => el.id === 'report').content;
const Report = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => <TilesMenu config={config} title="Raporty" breadcrumbs={[]} />}
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
      path={`${match.url}/DiagnosticPage`}
      component={DiagnosticPage}
    />
  </>
);

export default Report;
Report.propTypes = {
  match: matchPropTypes.isRequired,
};
