import React from 'react';
import { godPermission } from './permissions';
import __ from '../Translations';
import ForbiddenPage from './SecurityComponents/ForbiddenPage';

export const filterNavItemsByAlc = (menu, userInfo) => {
  const permissions = userInfo.getPermissions();
  return menu.map((item) => {
    if (item.aclKey && !permissions.includes(item.aclKey) && !permissions.includes(godPermission)) {
      return null;
    }
    const updatedItem = { ...item };
    if (item.content) {
      updatedItem.content = filterNavItemsByAlc(item.content, userInfo);
      if (updatedItem.content.length === 0) {
        return null;
      }
    }
    return updatedItem;
  }).filter(Boolean);
};

export const filterTabsByAcl = (tabsConfig, userInfo) => {
  const permissions = userInfo.getPermissions();
  return tabsConfig.map((item) => {
    if (item.aclKey && !permissions.includes(item.aclKey) && !permissions.includes(godPermission)) {
      return {
        ...item,
        component: <ForbiddenPage permission={item.aclKey} />,
        disabled: true,
        tabClassName: 'not-allowed',
        tabTitle: __('Nie masz uprawnień ({0})', [item.aclKey]),
      };
    }
    return item;
  }).filter(Boolean);
};

export const hasAccessTo = (userInfo, aclKey) => {
  const permissions = userInfo.getPermissions();
  return Boolean(permissions.includes(godPermission) || permissions.includes(aclKey));
};
