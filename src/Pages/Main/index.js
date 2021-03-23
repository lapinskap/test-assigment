import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';

import ResizeDetector from 'react-resize-detector';

import AppMain from '../../Layout/AppMain';

const Main = ({
  enableMobileMenu,
}) => (
  <ResizeDetector
    handleWidth
    render={({ width }) => (
      <>
        <div
          className={cx(
            'app-container app-theme-white fixed-header fixed-sidebar',
            { 'closed-sidebar': width < 1250 },
            {
              'closed-sidebar-mobile': width < 1250,
            },
            { 'sidebar-mobile-open': enableMobileMenu },
          )}
        >
          <AppMain />
        </div>
      </>
    )}
  />
);

const mapStateToProp = (state) => ({
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
});

export default withRouter(connect(mapStateToProp)(Main));

Main.propTypes = {
  enableMobileMenu: PropTypes.bool,
};
Main.defaultProps = {
  enableMobileMenu: null,
};
