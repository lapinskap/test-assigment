import React from 'react';
import { Link } from 'react-router-dom';
import AppMobileMenu from '../AppMobileMenu';

export default function AppLogo() {
  return (
    <>
      <div className="app-header__logo">
        <Link to="/">
          <div className="logo-src" data-t1="logo" />
        </Link>
      </div>
      <AppMobileMenu />
    </>
  );
}
