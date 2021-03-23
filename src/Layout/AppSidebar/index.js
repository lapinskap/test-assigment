import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import PerfectScrollbar from 'react-perfect-scrollbar';
import Sticky from 'react-stickynode';
import Nav from '../AppNav/VerticalNavWrapper';
import HeaderLogo from '../AppLogo';

export default function AppSidebar() {
  return (
    <>
      <div role="presentation" className="sidebar-mobile-overlay" />
      <CSSTransitionGroup
        component="div"
        className="app-sidebar"
        transitionName="SidebarAnimation"
        transitionAppear
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <HeaderLogo />
        <PerfectScrollbar>
          <Sticky top=".app-header" innerZ="100">
            <div className="app-sidebar__inner">
              <Nav />
            </div>
          </Sticky>
        </PerfectScrollbar>
        <div className="app-sidebar-bg" />
      </CSSTransitionGroup>
    </>
  );
}
