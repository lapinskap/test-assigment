import React, {
  Suspense, lazy, useContext, useState,
} from 'react';
import {
  Route, Redirect, useLocation, Switch,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SplitPane from 'react-split-pane';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';
// Layout
import AppHeader from '../AppHeader';
import AppSidebar from '../AppSidebar';
import MockApiWarning from '../../utils/Api/mockApiWarning';
import LanguageWrapper from '../../utils/Languages/languageWrapper';
import DefaultFallback from './DefaultFallback';
import { filterNavItemsByAlc, hasAccessTo } from '../../utils/RoleBasedSecurity/filters';
import { MainNav } from '../AppNav/NavItems';
import ErrorBoundary from './ErrorBoundary';
import NoAccessPage from './NoAccessPage';

const Authentication = lazy(() => import('../../Pages/Authentication'));
const Company = lazy(() => import('../../Pages/Company'));
const Standards = lazy(() => import('../../Pages/Standards'));

const defaultSidebarWidth = parseInt(localStorage.getItem('splitPos'), 10) || 320;

const startupPage = '/company/list';
const Router = () => {
  const { userInfo } = useContext(RbsContext);
  let defaultRedirect = startupPage;
  const hasPermissionToDefault = true;
  if (!hasPermissionToDefault) {
    const allowedPages = filterNavItemsByAlc(MainNav, userInfo);
    if (allowedPages.length) {
      if (allowedPages[0].content) {
        defaultRedirect = allowedPages[0].content[0].to;
      } else {
        defaultRedirect = allowedPages[0].to;
      }
    }
  }
  return (
    <Suspense fallback={DefaultFallback}>
      <Switch>
        {/* Dashboards */}
        <Route path="/company" component={Company} />
        {/* Standards */}
        <Route path="/standards" component={Standards} />
        {/* Default Redirect */}
        <Route render={() => <Redirect to={defaultRedirect} />} />
      </Switch>
    </Suspense>
  );
};

const AppMain = () => {
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const location = useLocation();
  const rbsContext = useContext(RbsContext);
  if (location.pathname.indexOf('/authentication/') === 0) {
    return (
      <Suspense fallback={DefaultFallback}>
        <Route path="/authentication" component={Authentication} />
      </Suspense>
    );
  }
  // if (!rbsContext.isLoggedIn) {
  //   window.location = `/signin/oauth/client/login${location.pathname ? `?referer_url=${encodeURIComponent(`/#${location.pathname}`)}` : ''}`;
  //   return DefaultFallback;
  // }

  // if (!rbsContext.userInfo.hasAccessToPanel()) {
  //   return <NoAccessPage logout={rbsContext.logout} />;
  // }

  return (
    <LanguageWrapper>
      <AppHeader />
      <div className="app-main">
        {/* <SplitPane
          split="vertical"
          minSize={280}
          style={{ height: 'inherit' }}
          resizerClassName="vertical-resizer"
          maxSize={600}
          allowResize
          defaultSize={defaultSidebarWidth}
          onChange={(size) => {
            localStorage.setItem('splitPos', size);
            setSidebarWidth(size);
          }}
        > */}
          {/* <AppSidebar /> */}
          <ErrorBoundary>
            <div className="app-main__outer" style={{ maxWidth: `${document.body.clientWidth - sidebarWidth}px` }}>
              <MockApiWarning />
              <div className="app-main__inner">
                <Router />
              </div>
            </div>
          </ErrorBoundary>
        {/* </SplitPane> */}
      </div>
      <ToastContainer />
    </LanguageWrapper>
  );
};
export default AppMain;
