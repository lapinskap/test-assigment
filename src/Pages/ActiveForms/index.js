import React from 'react';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import ActiveFormsList from './List';
import ActiveFormsEdit from './Edit';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { subscriptionActiveFormPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

const ActiveForms = ({ match }) => (
  <>
    <SecureRoute exact permission={subscriptionActiveFormPermissionRead} path={`${match.url}`} component={ActiveFormsList} />
    <SecureRoute exact permission={subscriptionActiveFormPermissionRead} path={`${match.url}/:formId`} component={ActiveFormsEdit} />
  </>
);

export default ActiveForms;
ActiveForms.propTypes = {
  match: matchPropTypes.isRequired,
};
