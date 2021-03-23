import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { connect } from 'react-redux';

import { CSSTransitionGroup } from 'react-transition-group';

import HeaderLogo from '../AppLogo';

import UserBox from './Components/UserBox';
import HeaderRightDrawer from './Components/HeaderRightDrawer';

import HeaderDots from './Components/HeaderDots';
import SearchBox from '../../Components/SearchBox';

const Header = ({ enableMobileMenuSmall }) => (
  <>
    <CSSTransitionGroup
      component="div"
      className="app-header header-shadow"
      transitionName="HeaderAnimation"
      transitionAppear
      transitionAppearTimeout={1500}
      transitionEnter={false}
      transitionLeave={false}
    >
      <HeaderLogo />
      <div className={cx('app-header__content', {
        'header-mobile-open': enableMobileMenuSmall,
      })}
      >
        <div className="app-header-left">
          <SearchBox />
        </div>
        <div className="app-header-right">
          <HeaderDots />
          <UserBox />
          <HeaderRightDrawer />
        </div>
      </div>
    </CSSTransitionGroup>
  </>
);

const mapStateToProps = (state) => ({
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

Header.propTypes = {
  enableMobileMenuSmall: PropTypes.string,
};

Header.defaultProps = {
  enableMobileMenuSmall: false,
};
