import React from 'react';
import { Route } from 'react-router-dom';
// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import OperatorList from './Operator/List';
import OperatorEdit from './Operator/Edit';
import RoleList from './Role/List';
import RoleEdit from './Role/Edit';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { operatorOperatorPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

const User = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'user').content}
          title="Operatorzy MB"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute permission={operatorOperatorPermissionRead} exact path={`${match.url}/operator`} component={OperatorList} />
    <SecureRoute permission={operatorOperatorPermissionRead} path={`${match.url}/operator/edit/:operatorId`} component={OperatorEdit} />
    <SecureRoute permission={operatorOperatorPermissionRead} exact path={`${match.url}/role`} component={RoleList} />
    <SecureRoute permission={operatorOperatorPermissionRead} path={`${match.url}/role/edit/:roleId`} component={RoleEdit} />
  </>
);

export default User;
User.propTypes = {
  match: matchPropTypes.isRequired,
};
