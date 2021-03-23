import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

export default function SidebarSimpleTabs({ tabsConfig, defaultKey }) {
  const history = useHistory();
  const locationHash = history.location.hash.replace('#', '');
  const [activeKey, setActiveKey] = useState(locationHash || defaultKey);
  useEffect(() => () => {
    const { hash } = history.location;
    setActiveKey(hash ? hash.replace('#', '') : defaultKey);
  }, [history.location, defaultKey]);

  const currentKey = activeKey || history.location.hash.replace('#', '');

  const currentTab = tabsConfig.find((item) => item.key === currentKey);
  return (
    <Card>
      <div className="forms-wizard-vertical">
        <div style={{ display: 'flex' }}>
          <div style={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
            <ol className="forms-wizard" style={{ width: '100%' }} data-t1="sidebarTabs">
              {
                  tabsConfig.map(({
                    key, name, icon, header,
                  }) => (header ? (
                    <li
                      className="form-wizard-step-header"
                      key={key || name}
                      data-t1={key}
                    >
                      <span className="title">{name}</span>
                      {icon ? <span className="icon">{React.createElement(icon, { size: 20 })}</span> : null}
                    </li>
                  ) : (
                    <Link key={key || name} to={`#${key}`} data-t1={key}>
                      <li
                        className={`form-wizard-step-${currentKey === key ? 'doing' : 'todo'}`}
                        key={key}
                      >
                        {icon ? <em>{React.createElement(icon)}</em> : null}
                        <span>{name}</span>
                      </li>
                    </Link>
                  )))
                        }
            </ol>
          </div>
          <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
            {currentTab ? currentTab.component : false}
          </CardBody>
        </div>
      </div>
    </Card>
  );
}

SidebarSimpleTabs.propTypes = {
  defaultKey: PropTypes.string.isRequired,
  tabsConfig: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.func,
  })).isRequired,
};
