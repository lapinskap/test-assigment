import React, {
  Suspense, lazy,
} from 'react';
import {
  Route, Redirect, Switch,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// Layout
import AppHeader from '../AppHeader';
import DefaultFallback from './DefaultFallback';
import ErrorBoundary from './ErrorBoundary';

const Dashboard = lazy(() => import('../../Pages/Dashboard'));

const startupPage = '/dashboard';
const Router = () => {
  let defaultRedirect = startupPage;
  return (
    <Suspense fallback={DefaultFallback}>
      <Switch>
        {/* Dashboards */}
        <Route path="/dashboard" component={Dashboard} />
        {/* Default Redirect */}
        <Route render={() => <Redirect to={defaultRedirect} />} />
      </Switch>
    </Suspense>
  );
};

const AppMain = () => {
  return (
    <>
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
          <ErrorBoundary>
            <div className="app-main__outer">
              <div className="app-main__inner">
                <Router />
              </div>
            </div>
          </ErrorBoundary>
        {/* </SplitPane> */}
      </div>
      <ToastContainer />
      </>
  );
};
export default AppMain;
