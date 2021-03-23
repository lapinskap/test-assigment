import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import AgreementList from './List';
import AgreementEdit from './Edit';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { agreementAgreementPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

const Agreements = ({ match }) => (
  <>
    <SecureRoute permission={agreementAgreementPermissionRead} exact path={`${match.url}`} component={AgreementList} />
    <SecureRoute permission={agreementAgreementPermissionRead} exact path={`${match.url}/:agreementId`} component={AgreementEdit} />
  </>
);

export default Agreements;
Agreements.propTypes = {
  match: matchPropTypes.isRequired,
};
