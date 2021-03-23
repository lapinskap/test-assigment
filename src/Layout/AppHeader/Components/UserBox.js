import React, { useContext } from 'react';

import {
  DropdownToggle,
  DropdownMenu,
  Button,
  UncontrolledButtonDropdown,
} from 'reactstrap';

import { faAngleDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';
import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg';
import __ from '../../../utils/Translations';

const UserBox = () => {
  const { logout, userInfo } = useContext(RbsContext);
  // const userName = `${userInfo.getFirstName()} ${userInfo.getLastName()}`;
  const userName = 'test user';
  // const role = userInfo.getRole();
  // const email = userInfo.getEmail();
  const role = 'admin';
  const email = 'admin@test.com';
  return (
    <>
      <div className="header-btn-lg pr-0" data-t1="userInfoBox">
        <div className="widget-content p-0">
          <div className="widget-content-wrapper">
            <div className="widget-content-left">
              <UncontrolledButtonDropdown>
                <DropdownToggle color="link" className="p-0">
                  <FontAwesomeIcon
                    size="2x"
                    icon={faUser}
                  />
                  <FontAwesomeIcon
                    className="ml-2 opacity-8"
                    icon={faAngleDown}
                  />
                </DropdownToggle>
                <DropdownMenu right className="rm-pointers dropdown-menu-lg" style={{ padding: 0 }} data-t1="UserDetails">
                  <div className="dropdown-menu-header">
                    <div className="dropdown-menu-header-inner bg-info">
                      <div
                        className="menu-header-image opacity-2"
                        style={{
                          backgroundImage: `url(${city3})`,
                        }}
                      />
                      <div className="menu-header-content text-left">
                        <div className="widget-content p-0">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left mr-3">
                              <FontAwesomeIcon
                                size="2x"
                                icon={faUser}
                              />
                            </div>
                            <div className="widget-content-left">
                              <div className="widget-heading">
                                {userName}
                              </div>
                              <div className="widget-subheading">{email}</div>
                              <div className="widget-subheading">
                                {__('Rola')}
                                :
                                {' '}
                                {role}
                              </div>
                            </div>
                            <div className="widget-content-right mr-2">
                              <Button data-t1="logout" className="btn-pill btn-shadow btn-shine" color="focus" onClick={logout}>
                                Wyloguj
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
            <div className="widget-content-left  ml-3 header-user-info">
              <div className="widget-heading">{userName}</div>
              <div className="widget-subheading">{email}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
