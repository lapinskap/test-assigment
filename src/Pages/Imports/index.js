import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';

// Pages
import CmsImport from './CMS';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { cmsDocumentPermissionWrite } from '../../utils/RoleBasedSecurity/permissions';

const Imports = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'imports').content}
          title="Importy"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute permission={cmsDocumentPermissionWrite} path={`${match.url}/cms`} component={CmsImport} heading="Import dokumentów CMS" />
  </>
);

export default Imports;
Imports.propTypes = {
  match: matchPropTypes.isRequired,
};
