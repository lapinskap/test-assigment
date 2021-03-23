import React from 'react';
import { Route } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';

// Pages
import Main from './Main';

const Dashboard = ({ match }) => (
  <>
    <Route
      exact
      path={`${match.url}`}
      render={() => (
        <div>test</div>
      )}
    />
    <Route
      exact
      path={`${match.url}/main`}
      component={Main}
    />
  </>
);

export default Dashboard;

Dashboard.propTypes = {
  match: matchPropTypes.isRequired,
};
