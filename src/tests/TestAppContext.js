import PropTypes from 'prop-types';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../config/configureStore';
import { getUserConfirmationPopup } from '../Components/UserConfirmationPopup';
import RbsContext from '../utils/RoleBasedSecurity/RbsContext';
import LanguageWrapper from '../utils/Languages/languageWrapper';
import { godPermission } from '../utils/RoleBasedSecurity/permissions';
import UserInfo from '../utils/RoleBasedSecurity/UserInfo';

const store = configureStore();
const getRouter = (use, children) => (use ? (
  <HashRouter getUserConfirmation={getUserConfirmationPopup}>{children}</HashRouter>
) : children);
const getRbsWrapper = (use, children) => (use
  ? (
    <RbsContext.Provider
      value={
          { userInfo: new UserInfo({ permissions: [godPermission] }) }
      }
    >
      {children}
    </RbsContext.Provider>
  )
  : children);
const getLanguageWrapper = (use, children) => (use ? (<LanguageWrapper>{children}</LanguageWrapper>) : children);
const getRedux = (use, children) => (use ? (<Provider store={store}>{children}</Provider>) : children);

export default function TestAppContext({
  redux = false, language = false, rbs = false, router = false, children,
}) {
  let context = children;
  context = getRouter(router, context);
  context = getRbsWrapper(rbs, context);
  context = getLanguageWrapper(language, context);
  context = getRedux(redux, context);
  return context;
}

TestAppContext.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.bool,
  rbs: PropTypes.bool,
  redux: PropTypes.bool,
  router: PropTypes.bool,
};

TestAppContext.defaultProps = {
  language: false,
  rbs: false,
  redux: false,
  router: false,
};
