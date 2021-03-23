import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import {
  notificationAppMessagePermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';
import AppMessagesList from './AppMessages/List';
import AppMessagesEdit from './AppMessages/Edit';

const Notifications = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'notification').content}
          title="Powiadomienia"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute
      permission={notificationAppMessagePermissionRead}
      exact
      path={`${match.url}/app-messages`}
      component={AppMessagesList}
    />
    <SecureRoute
      permission={notificationAppMessagePermissionRead}
      exact
      path={`${match.url}/app-messages/:appMessageId`}
      component={AppMessagesEdit}
    />
  </>
);

export default Notifications;
Notifications.propTypes = {
  match: matchPropTypes.isRequired,
};
