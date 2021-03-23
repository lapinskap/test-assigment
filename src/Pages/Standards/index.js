import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import GridFilterableBackend from './GridFilterableBackend';
import GridFilterableJs from './GridFilterableJs';
import TabsWithMemory from './TabsWithMemory';
import TabsSimple from './TabsSimple';
import SidebarTabs from './SidebarTabs';
import Forms from './Forms';
import TilesMenu from '../../Components/TilesMenu';
import { MainNav } from '../../Layout/AppNav/NavItems';

const Standards = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <TilesMenu
          config={MainNav.find((el) => el.id === 'standards').content}
          title="Standardy"
          breadcrumbs={[]}
        />
      )}
    />

    <Route path={`${match.url}/grid/filtrable-backend`} component={GridFilterableBackend} />
    <Route path={`${match.url}/grid/filtrable-js`} component={GridFilterableJs} />
    <Route path={`${match.url}/tabs/with-memo`} component={TabsWithMemory} />
    <Route path={`${match.url}/tabs/simple`} component={TabsSimple} />
    <Route path={`${match.url}/tabs/sidebar`} component={SidebarTabs} />
    <Route path={`${match.url}/forms`} component={Forms} />
  </>
);

export default Standards;
Standards.propTypes = {
  match: matchPropTypes.isRequired,
};
