import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import useHasPermission from '../../hooks/security/useHasPermission';
import ForbiddenPage from './ForbiddenPage';

const SecureRoute = ({ permission, ...routeProps }) => {
  const hasPermissions = useHasPermission(permission);
  if (!hasPermissions) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...routeProps} component={null} render={() => <ForbiddenPage permission={permission} />} />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...routeProps} />;
};

export default SecureRoute;

SecureRoute.propTypes = {
  permission: PropTypes.string.isRequired,
};
