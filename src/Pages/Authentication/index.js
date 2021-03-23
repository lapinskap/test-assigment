import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import Login from './Login';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';

const Authentication = ({ match }) => {
  const rbsContext = useContext(RbsContext);
  const { isLoggedIn } = rbsContext;

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="app-container">
        <Route path={`${match.url}/login`} component={Login} />
      </div>
    </>
  );
};

export default Authentication;
Authentication.propTypes = {
  match: matchPropTypes.isRequired,
};
