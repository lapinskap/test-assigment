import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

export default function DefaultHashTabBar({ panels, activeKey, noCards }) {
  const getTabClassesWrapper = useCallback((panel) => {
    const classes = ['rc-tabs-tab'];
    if (activeKey === panel.key) {
      classes.push('rc-tabs-tab-active');
    }
    if (panel.props.disabled) {
      classes.push('rc-tabs-tab-disabled');
    }

    return classes.join(' ');
  }, [activeKey]);

  const hashBar = (
    <div role="tablist" className="rc-tabs-bar" tabIndex="0" data-t1="tabs">
      <div>
        {panels.map((panel) => {
          if (!panel) {
            return false;
          }
          const tab = (
            <div
              data-t1={panel.key}
              role="tab"
              aria-disabled="false"
              aria-selected="true"
              className={getTabClassesWrapper(panel)}
            >
              {panel.props.tab}
            </div>
          );
          if (panel.props.disabled || activeKey === panel.key) {
            return (
              <span key={panel.key} className="rc-tabs-tab-link">
                {tab}
              </span>
            );
          }
          const onClick = panel.onClick || panel.props.onClick;
          return onClick ? (
            <span role="presentation" key={panel.key} className="rc-tabs-tab-link" onClick={onClick}>
              {tab}
            </span>
          ) : (
            <Link key={panel.key} className="rc-tabs-tab-link" to={`#${panel.key}`}>
              {tab}
            </Link>
          );
        })}
      </div>
    </div>
  );
  return (
    noCards ? hashBar
      : (
        <Card className="my-3">
          <CardBody>{hashBar}</CardBody>
        </Card>
      )
  );
}
// No forbidExtraProps because its receive many props from third party library which we do not use
DefaultHashTabBar.propTypes = {
  activeKey: PropTypes.string,
  noCards: PropTypes.bool,
  panels: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    key: PropTypes.string,
    component: PropTypes.node,
    disabled: PropTypes.bool,
    noCards: PropTypes.bool,
    onClick: PropTypes.func,
    props: PropTypes.shape({
      disabled: PropTypes.bool,
      tab: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    }),
  })),
};
DefaultHashTabBar.defaultProps = {
  activeKey: '',
  panels: [],
  noCards: false,
};
