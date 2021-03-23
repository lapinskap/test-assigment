import React from 'react';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import Management from './Management';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { cmsDocumentPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

const Cms = ({ match }) => (
  <>
    <SecureRoute permission={cmsDocumentPermissionRead} exact path={`${match.url}/management`} component={Management} />
    <SecureRoute permission={cmsDocumentPermissionRead} path={`${match.url}/management/:companyId/:employeeGroupId`} component={Management} />
  </>
);

export default Cms;
Cms.propTypes = {
  match: matchPropTypes.isRequired,
};
