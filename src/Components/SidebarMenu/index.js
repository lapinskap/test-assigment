import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import React, { Fragment, useEffect, useState } from 'react';
import __ from '../../utils/Translations';

export default function SidebarMenu({ content, linkId, isSubMenu }) {
  const history = useHistory();
  const [activeId, setActiveId] = useState(
    linkId || getActiveId(content, history.location.pathname),
  );
  const [openedSubmenu, setOpenedSubMenu] = useState(getDefaultOpenedTab(content, activeId));
  const toggleSubmenu = (submenuId) => {
    setOpenedSubMenu(submenuId === openedSubmenu ? '' : submenuId);
  };

  useEffect(() => history.listen((location) => {
    const newId = getActiveId(content, location.pathname);
    setActiveId(newId);
    if (newId) {
      const item = content.find((el) => el.id === newId);
      if (item && item.content && item.content.length) {
        setOpenedSubMenu(newId);
      }
    }
  }));
  return (
    <div className={isSubMenu ? 'sub-menu metismenu vertical-nav-menu' : 'main-menu metismenu vertical-nav-menu'}>
      <ul className="metismenu-container" data-t1="sidebarMenu">
        {content.map((item) => {
          const {
            id, to, content: itemContent, label, icon,
          } = item;
          const hasSubmenu = itemContent && itemContent.length;
          const hasActiveChild = hasSubmenu && itemContent.find(
            (subItem) => subItem.id === activeId,
          );
          const isOpen = hasSubmenu && (openedSubmenu === id);
          const isActive = activeId === id;
          return (
            <Fragment key={id}>
              <li className="metismenu-item">
                <Link
                  data-t1={id}
                  className={`metismenu-link${hasActiveChild ? ' has-active-child' : ''}${isActive ? ' active' : ''}`}
                  to={to || '#'}
                  onClick={() => toggleSubmenu(id)}
                >
                  <i className={`metismenu-icon${icon ? ` ${icon}` : ''}`} />
                  {__(label)}
                  {hasSubmenu ? (
                    <i className={`metismenu-state-icon pe-7s-angle-down caret-left${isOpen ? ' rotate-minus-90' : ''}`} />
                  ) : null}
                </Link>
                {hasSubmenu ? (
                  <ul className={`metismenu-container${isOpen ? ' visible' : ''}`}>
                    {itemContent.map((subItem) => (
                      <li className="metismenu-item" key={subItem.id}>
                        <Link
                          data-t1={subItem.id}
                          className={`metismenu-link${activeId === subItem.id ? ' active' : ''}`}
                          to={subItem.to}
                        >
                          <i className={`metismenu-icon${subItem.icon ? ` ${subItem.icon}` : ''}`} />
                          {__(subItem.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}

const getDefaultOpenedTab = (content, activeId) => {
  const tab = content.find(
    (item) => item.content && item.content.find((subItem) => subItem.id === activeId),
  );
  return tab ? tab.id : null;
};

export const isActiveItem = (item, pathname, isAnchor) => {
  if (item.to) {
    return isAnchor ? pathname.startsWith(item.to) : item.to === pathname;
  }
  return false;
};

export const getActiveId = (content, pathname) => {
  for (let i = 0; i < content.length; i += 1) {
    const item = content[i];
    if (isActiveItem(item, pathname, item.isAnchor)) {
      return item.id;
    }
    if (item.content) {
      const subItem = item.content.find((el) => isActiveItem(el, pathname, true));
      if (subItem) {
        return subItem.id;
      }
    }
  }
  return null;
};

SidebarMenu.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    to: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    strict: PropTypes.bool,
    content: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      to: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.string,
      strict: PropTypes.bool,
    })),
  })).isRequired,
  linkId: PropTypes.string,
  isSubMenu: PropTypes.bool.isRequired,
};

SidebarMenu.defaultProps = {
  linkId: '',
};
