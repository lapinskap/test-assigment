import PropTypes from 'prop-types';
import React, {
  cloneElement, useState, useContext,
} from 'react';
import { useHistory, Prompt } from 'react-router-dom';
import { MdModeEdit } from 'react-icons/md';

import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import DefaultHashTabBar from './DefaultHashTabBar';
import { filterTabsByAcl } from '../../utils/RoleBasedSecurity/filters';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';

export default function TabsWithMemory({
  tabsConfig = [], activeKey, defaultActiveKey, animated = false, promptWhenUnsaved = true,
}) {
  const [editedTabs, setEditedTabs] = useState({});
  const { userInfo } = useContext(RbsContext);
  const history = useHistory();

  const setTabIsEdited = (key, value) => {
    if (editedTabs[key] !== value) {
      const newState = { ...editedTabs };
      newState[key] = value;
      setEditedTabs(newState);
    }
  };

  const getTabComponent = (name, key, className, title) => {
    if (editedTabs[key]) {
      return (
        <span className={className} title={title}>
          {name}
&nbsp;
          <MdModeEdit style={{ position: 'absolute', top: '8px' }} fontSize="15px" />
        </span>
      );
    }
    return <span className={className} title={title}>{name}</span>;
  };

  const getLeaveWarningMessage = (unsavedTabsKeys, location) => {
    if (location.pathname === history.location.pathname) {
      return '';
    }
    const unsavedTabsName = unsavedTabsKeys.map((key) => {
      const tab = tabsConfig.find((el) => el.key === key);
      return tab ? tab.name : null;
    }).filter(Boolean);
    if (unsavedTabsName.length === 1) {
      return `Masz niezapisany formularz w zakładce ${unsavedTabsName[0]}. Niezapisane zmiany zostaną utracone.`;
    }
    return `Masz niezapisane formularze w zakładkach:${unsavedTabsName
      ? ` ${unsavedTabsName.join(', ')}.` : ','} Niezapisane zmiany zostaną utracone.`;
  };

  const currentKey = activeKey || defaultActiveKey;

  const unsavedForms = Object.keys(editedTabs).filter((key) => Boolean(editedTabs[key]));

  return (
    <>
      <Tabs
        animated={animated}
        activeKey={currentKey}
        renderTabBar={() => <DefaultHashTabBar />}
        renderTabContent={() => <TabContent animated={animated} />}
      >
        {filterTabsByAcl(tabsConfig, userInfo).map(({
          name, key, component, disabled, tabClassName = null, tabTitle = null, display = true,
        }) => (display ? (
          <TabPane tab={getTabComponent(name, key, tabClassName, tabTitle)} key={key} disabled={Boolean(disabled)}>
            {cloneElement(component, {
              active: currentKey === key,
              setIsEdited: (state) => setTabIsEdited(key, state),
            })}
          </TabPane>
        ) : null))}
      </Tabs>
      {promptWhenUnsaved ? (
        <Prompt
          when={unsavedForms.length > 0}
          message={(location) => getLeaveWarningMessage(unsavedForms, location)}
        />
      ) : null}
    </>
  );
}

TabsWithMemory.propTypes = {
  activeKey: PropTypes.string,
  animated: PropTypes.bool,
  defaultActiveKey: PropTypes.string.isRequired,
  promptWhenUnsaved: PropTypes.bool,
  tabsConfig: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    key: PropTypes.string,
    aclKey: PropTypes.string,
    component: PropTypes.node,
    disabled: PropTypes.bool,
  })).isRequired,
};

TabsWithMemory.defaultProps = {
  activeKey: '',
  animated: false,
  promptWhenUnsaved: true,
};
