import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import InspectorWrapper from './devInspector/prod';
import * as serviceWorker from './serviceWorker';

import './assets/base.scss';
import Main from './Pages/Main';
import configureStore from './config/configureStore';
import { getUserConfirmationPopup } from './Components/UserConfirmationPopup';
import RbsAppWrapper from './utils/RoleBasedSecurity/RbsAppWrapper';

const store = configureStore();
const rootElement = document.getElementById('root');

const renderApp = (Component) => {
  ReactDOM.render(
    <InspectorWrapper
      keys={['control', 'alt', 'z']}
      disableLaunchEditor={false}
      onHoverElement={(params) => {}}
      onClickElement={(params) => {}}
    >
      <Provider store={store}>
        <RbsAppWrapper>
          <HashRouter getUserConfirmation={getUserConfirmationPopup}>
            <Component />
          </HashRouter>
        </RbsAppWrapper>
      </Provider>
    </InspectorWrapper>,
    rootElement,
  );
};

renderApp(Main);

if (module.hot) {
  module.hot.accept('./Pages/Main', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./Pages/Main').default;
    renderApp(NextApp);
  });
}
serviceWorker.unregister();
