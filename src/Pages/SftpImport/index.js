import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import SftpImportList from './List';
import SftpImportEdit from './Edit';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { employeeEmployeePermissionWrite } from '../../utils/RoleBasedSecurity/permissions';

const Agreements = ({ match }) => (
  <>
    <SecureRoute permission={employeeEmployeePermissionWrite} exact path={`${match.url}`} component={SftpImportList} />
    <SecureRoute permission={employeeEmployeePermissionWrite} path={`${match.url}/:id`} component={SftpImportEdit} />
  </>
);

export default Agreements;
Agreements.propTypes = {
  match: matchPropTypes.isRequired,
};
