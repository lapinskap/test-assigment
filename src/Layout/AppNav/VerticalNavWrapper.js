import React, {
  useState, useEffect, useContext,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';
import {
  AhrMainNav,
  MainNav,
} from './NavItems';
import { getSubMenuByLocation, getSubMenuComponentByCode } from './SubMenuItems';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';
import { filterNavItemsByAlc } from '../../utils/RoleBasedSecurity/filters';
import SidebarMenu from '../../Components/SidebarMenu';

const Nav = () => {
  const history = useHistory();
  const rbsContext = useContext(RbsContext);
  const ahrMenu = false;
  const [currentSubmenu, setCurrentSubmenu] = useState(
    getSubMenuByLocation(history.location.pathname, ahrMenu),
  );
  const [showSubMenu, setShowSubMenu] = useState(Boolean(currentSubmenu));

  useEffect(() => history.listen((location) => {
    const submenu = getSubMenuByLocation(location.pathname, ahrMenu);
    if (submenu !== currentSubmenu) {
      setCurrentSubmenu(submenu);
      setShowSubMenu(true);
    }
  }), [currentSubmenu, history, ahrMenu]);

  if (showSubMenu && currentSubmenu && !ahrMenu) {
    const subMenu = getSubMenuComponentByCode(currentSubmenu);
    return subMenu ? (
      <>
        <Button
          data-t1="menuSwitcher"
          className="position-absolute mb-2 btn-icon btn-icon-only"
          color="link"
          outline
          style={{ right: 0, zIndex: 100 }}
          onClick={() => setShowSubMenu(false)}
        >
          <i className="pe-7s-angle-left-circle btn-icon-wrapper"> </i>
        </Button>
        <h5 className="app-sidebar__heading pr-3">{subMenu.getTitle(history.location.pathname)}</h5>
        <SidebarMenu
          key="main_menu"
          content={
            ahrMenu
              ? subMenu.getConfig(history.location.pathname)
              : filterNavItemsByAlc(subMenu.getConfig(history.location.pathname), rbsContext.userInfo)
          }
          isSubMenu
        />
      </>
    ) : null;
  }
  let linkId = null;
  if (currentSubmenu) {
    const subMenu = getSubMenuComponentByCode(currentSubmenu);
    linkId = subMenu ? subMenu.parent_id : null;
  }
  return (
    <>
      {currentSubmenu ? (
        <Button
          data-t1="menuSwitcher"
          className="position-absolute mb-2 btn-icon btn-icon-only"
          color="link"
          outline
          style={{ right: 0, zIndex: 100 }}
          onClick={() => setShowSubMenu(true)}
        >
          <i className="pe-7s-angle-right-circle btn-icon-wrapper"> </i>
        </Button>
      ) : null}
      <h5 className="app-sidebar__heading">Menu</h5>
      <SidebarMenu
        key="sub_menu"
        content={ahrMenu ? AhrMainNav : filterNavItemsByAlc(MainNav, rbsContext.userInfo)}
        linkId={linkId}
        isSubMenu={false}
      />
    </>
  );
};

export default Nav;
