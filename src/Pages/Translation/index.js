import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import Interface from './Interface';
import Simple from './Simple';
import Description from './Description';
import Scope from './Scope';
import LanguagesWrapper from './LanguagesWrapper';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import {
  translationTranslateCmsPermissionWrite,
  translationTranslateSimplePermissionWrite,
  translationTranslationScopePermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';

const Translations = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'translate').content}
          title="Tłumaczenia"
          breadcrumbs={[]}
        />
      )}
    />
    <SecureRoute
      permission={translationTranslateSimplePermissionWrite}
      path={`${match.url}/interface`}
      render={() => <LanguagesWrapper Component={<Interface />} heading="Tłumaczenia interfejsu" />}
    />
    <SecureRoute
      permission={translationTranslateSimplePermissionWrite}
      path={`${match.url}/simple`}
      render={() => <LanguagesWrapper Component={<Simple />} heading="Tłumaczenia wartości prostych" />}
    />
    <SecureRoute
      permission={translationTranslateCmsPermissionWrite}
      path={`${match.url}/description`}
      render={() => <LanguagesWrapper Component={<Description />} heading="Tłumaczenia opisów" />}
    />
    <SecureRoute
      permission={translationTranslationScopePermissionRead}
      path={`${match.url}/scopes`}
      component={Scope}
    />
  </>
);

export default Translations;
Translations.propTypes = {
  match: matchPropTypes.isRequired,
};
