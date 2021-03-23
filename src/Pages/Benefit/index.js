import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import List from './List';

const Benefit = ({ match }) => (
  <>
    <Route path={`${match.url}/list`} component={List} />
  </>
);

export default Benefit;
Benefit.propTypes = {
  match: matchPropTypes.isRequired,
};
