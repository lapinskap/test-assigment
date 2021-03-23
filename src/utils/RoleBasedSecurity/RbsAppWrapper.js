import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import RbsContext from './RbsContext';
import {
  clearSessionData, deleteSession, getSession, getUserInfo, initSession,
} from './Session';
import __ from '../Translations';
import tmpAuthorization from './tmpAuthorization';
import DefaultFallback from '../../Layout/AppMain/DefaultFallback';
import UserInfo from './UserInfo';

export default function RbsAppWrapper({ children }) {
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLogged] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeSession();
  }, []);

  const tmpLoginAction = async (type) => {
    try {
      const {
        token, refresh_token: refreshToken, date, expiresIn, userInfo: user,
      } = await tmpAuthorization(type);

      const session = getSession();
      await session.login(token, refreshToken, date, expiresIn);
      setUserInfo(new UserInfo(user));
      setIsLogged(Boolean(await session.getValidAccessToken()));
      return null;
    } catch (e) {
      console.error(e);
      return __('Nieprawidłowy login lub hasło');
    }
  };
  const logoutAction = async () => {
    try {
      clearSessionData();
      await new Promise((resolve) => {
        window.location = `/signin/oauth/logout?redirect_url=${window.location.origin}`;
        setTimeout(() => resolve(), 5000);
      });
      return null;
    } catch (e) {
      console.error(e);
      return __('Nie udaoło się wylogować');
    }
  };

  const initializeSession = async () => {
    const session = await initSession();
    let isAlreadyLoggedIn = Boolean(await session.getValidAccessToken());
    if (isAlreadyLoggedIn) {
      try {
        const user = await getUserInfo();
        setUserInfo(new UserInfo(user));
      } catch (e) {
        clearSessionData();
        deleteSession();
        await initSession();
        isAlreadyLoggedIn = false;
      }
    }

    setIsLogged(isAlreadyLoggedIn);
    setIsInitializing(false);
  };

  if (isInitializing) {
    return DefaultFallback;
  }
  return (
    <RbsContext.Provider value={{
      isLoggedIn,
      login: tmpLoginAction,
      logout: logoutAction,
      userInfo,
    }}
    >
      {children}
    </RbsContext.Provider>
  );
}

RbsAppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
