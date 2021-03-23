import React from 'react';
import { withRouter } from 'react-router-dom';
import MetisMenu from 'react-metismenu';
import { MainNav } from './NavItems';

const NavDummy = () => (
  <>
    <h5 className="app-sidebar__heading">Menu</h5>
    <MetisMenu
      content={MainNav}
      activeLinkFromLocation
      className="vertical-nav-menu"
      classNameStateIcon="pe-7s-angle-down"
    />
  </>
);

export default withRouter(NavDummy);
