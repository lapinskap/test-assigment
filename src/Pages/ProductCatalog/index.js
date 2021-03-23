import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';

// Pages
import ProductsList from './List';
import EditProduct from './EditProduct';
import BusinessCategory from './BusinessCategory';
import SubscriptionCategory from './SubscriptionCategory';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import { catalogCategoryPermissionRead, catalogProductPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

const ProductCatalog = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'productCatalog').content}
          title="Katalog produktów"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute
      permission={catalogProductPermissionRead}
      exact
      path={`${match.url}/products`}
      component={ProductsList}
      heading="Lista benefitów"
    />
    <SecureRoute
      permission={catalogProductPermissionRead}
      path={`${match.url}/products/:productId/:type`}
      component={EditProduct}
      heading="Edycja produktu"
    />
    <SecureRoute
      permission={catalogCategoryPermissionRead}
      path={`${match.url}/business-category`}
      component={BusinessCategory}
      heading="Kategorie biznesowe"
    />
    <SecureRoute
      permission={catalogCategoryPermissionRead}
      path={`${match.url}/subscription-category`}
      component={SubscriptionCategory}
      heading="Kategorie abonamentowe"
    />
  </>
);

export default ProductCatalog;
ProductCatalog.propTypes = {
  match: matchPropTypes.isRequired,
};
