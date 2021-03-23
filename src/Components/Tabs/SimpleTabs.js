import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import DefaultHashTabBar from './DefaultHashTabBar';
import { filterTabsByAcl } from '../../utils/RoleBasedSecurity/filters';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';

export default function SimpleTabs({
  tabsConfig = [], activeKey, defaultActiveKey, animated = false, destroyInactiveTabPane = true,
}) {
  const { userInfo } = useContext(RbsContext);
  const currentKey = activeKey || defaultActiveKey;
  return (
    <Tabs
      animated={animated}
      activeKey={currentKey}
      destroyInactiveTabPane={destroyInactiveTabPane}
      renderTabBar={() => <DefaultHashTabBar />}
      renderTabContent={() => <TabContent animated={animated} />}
    >
      {filterTabsByAcl(tabsConfig, userInfo).map(({
        name, key, component, disabled, tabClassName = null, tabTitle = null,
      }) => (
        <TabPane
          tab={<span className={tabClassName} title={tabTitle}>{name}</span>}
          key={key}
          disabled={Boolean(disabled)}
        >
          {component}
        </TabPane>
      ))}
    </Tabs>
  );
}

SimpleTabs.propTypes = {
  activeKey: PropTypes.string,
  animated: PropTypes.bool,
  destroyInactiveTabPane: PropTypes.bool,
  defaultActiveKey: PropTypes.string.isRequired,
  tabsConfig: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    key: PropTypes.string,
    component: PropTypes.node,
    disabled: PropTypes.bool,
  })).isRequired,
};

SimpleTabs.defaultProps = {
  activeKey: '',
  animated: false,
  destroyInactiveTabPane: true,
};
