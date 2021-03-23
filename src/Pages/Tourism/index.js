import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';

// Pages
import ListOfObjects from './listOfObjects/index';
import ListOfSuppliers from './listOfSuppliers/index';
import EditObject from './listOfObjects/editObject/index';
import ManagingFilteringAttributes from './managingFilteringAttributes/index';
import MassAttributeUpdate from './massAttributeUpdate/index';
import EditSupplier from './listOfSuppliers/editSupplier';
import {
  tourismTourismAttributePermissionRead,
  tourismTourismObjectPermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';

const Tourism = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'tourism').content}
          title="Turystyka"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute
      permission={tourismTourismObjectPermissionRead}
      exact
      path={`${match.url}/objects`}
      component={ListOfObjects}
      heading="Lista obiektów turystycznych"
    />
    <SecureRoute
      permission={tourismTourismObjectPermissionRead}
      path={`${match.url}/objects/edit/:id`}
      component={EditObject}
      heading="Edytuj obiekt"
    />
    <SecureRoute
      permission={tourismTourismObjectPermissionRead}
      exact
      path={`${match.url}/suppliers`}
      component={ListOfSuppliers}
      heading="Lista dostawców"
    />
    <SecureRoute
      permission={tourismTourismObjectPermissionRead}
      exact
      path={`${match.url}/suppliers/edit/:supplierId`}
      component={EditSupplier}
      heading="Edytuj dostawcę"
    />
    <SecureRoute
      permission={tourismTourismAttributePermissionRead}
      path={`${match.url}/objects/mass-attribite-update`}
      component={MassAttributeUpdate}
      heading="Masowa aktualizacja atrybutów obiektów"
    />
    <SecureRoute
      permission={tourismTourismAttributePermissionRead}
      path={`${match.url}/managing-filtering-attributes`}
      render={() => <ManagingFilteringAttributes />}
      heading="Zarządzanie atrybutami filtrowania"
    />
  </>
);

export default Tourism;
Tourism.propTypes = {
  match: matchPropTypes.isRequired,
};
