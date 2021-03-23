import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { MainNav } from '../../Layout/AppNav/NavItems';

// Pages
import Configuration from './Configuration';
import Dictionary from './Dictionary';
import DictionaryEdit from './Dictionary/Edit/index';
import IpSecurity from './IpSecurity/index';
import TilesMenu from '../../Components/TilesMenu';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import {
  configurationConfigurationPermissionRead,
  dictionaryDictionaryPermissionRead, ssoIpAddressRestrictionPermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';

const Company = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'administration').content}
          title="Administracja"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute
      permission={configurationConfigurationPermissionRead}
      exact
      path={`${match.url}/configuration`}
      component={Configuration}
    />
    <SecureRoute
      permission={configurationConfigurationPermissionRead}
      path={`${match.url}/configuration/:companyId/:employeeGroupId`}
      component={Configuration}
    />
    <SecureRoute
      permission={dictionaryDictionaryPermissionRead}
      exact
      path={`${match.url}/dictionary`}
      component={Dictionary}
    />
    <SecureRoute
      permission={dictionaryDictionaryPermissionRead}
      exact
      path={`${match.url}/dictionary/:editId`}
      component={DictionaryEdit}
    />
    <SecureRoute
      permission={ssoIpAddressRestrictionPermissionRead}
      path={`${match.url}/ip-security`}
      component={IpSecurity}
    />
  </>
);

export default Company;

Company.propTypes = {
  match: matchPropTypes.isRequired,
};
