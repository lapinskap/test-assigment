import React from 'react';
import UserInfo from './UserInfo';

const RbsContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userInfo: new UserInfo({}),
});
export default RbsContext;
