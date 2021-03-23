import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Route } from 'react-router-dom';
import AppHeader from '../../Layout/AppHeader';

import AppFooter from '../../Layout/AppFooter';

import GisMain from './Main/main';

const Gis = ({ match }) => (

  <>
    <AppHeader />
    <div className="app-main">
      <div className="app-main__outer">
        <div className="app-main__inner">

          <div>test test test</div>

          {/* <Route path={`${match.url}`} component={GisMain} /> */}

        </div>
        <AppFooter />
      </div>
    </div>
  </>
);

export default Gis;

Gis.propTypes = {
  match: matchPropTypes.isRequired,
};
