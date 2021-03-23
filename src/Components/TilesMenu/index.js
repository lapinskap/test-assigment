import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import React, { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageTitle from '../../Layout/AppMain/PageTitle';
import { filterNavItemsByAlc } from '../../utils/RoleBasedSecurity/filters';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';

export default function TilesMenu({
  title, breadcrumbs, config, pushToHistory,
}) {
  const { userInfo } = useContext(RbsContext);
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          pushToHistory={pushToHistory}
          heading={title}
          breadcrumbs={breadcrumbs}
        />
        <div className="grid-menu grid-menu-4col">
          <Row className="no-gutters" data-t1="tilesMenu">
            {filterNavItemsByAlc(config, userInfo).map(({
              to, label, icon, tileIcon, id,
            }) => (
              <Col md="3" sm="6" className="bg-white" key={id}>
                <Link to={to} className="link-unstyled" data-t1={id}>
                  <div className="widget-chart widget-chart-hover">
                    <div className="icon-wrapper rounded-circle">
                      <div className="icon-wrapper-bg bg-primary" />
                      <i className={`${tileIcon || icon} text-primary`} />
                    </div>
                    <div className="widget-numbers-sm">{label}</div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </CSSTransitionGroup>
    </>
  );
}
TilesMenu.propTypes = {
  title: PropTypes.string.isRequired,
  pushToHistory: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ),
  config: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    tileIcon: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
  })).isRequired,
};
TilesMenu.defaultProps = {
  breadcrumbs: [],
  pushToHistory: false,
};
