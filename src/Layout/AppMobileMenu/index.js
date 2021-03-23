import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Slider } from 'react-burgers';

import cx from 'classnames';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from 'reactstrap';

import {
  setEnableMobileMenu,
  setEnableMobileMenuSmall,
} from '../../reducers/ThemeOptions';

class AppMobileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      activeSecondaryMenuMobile: false,
    };
  }

  toggleMobileSidebar = () => {
    // eslint-disable-next-line no-shadow
    const { enableMobileMenu, setEnableMobileMenu } = this.props;
    setEnableMobileMenu(!enableMobileMenu);
  };

  toggleMobileSmall = () => {
    // eslint-disable-next-line no-shadow
    const { enableMobileMenuSmall, setEnableMobileMenuSmall } = this.props;
    setEnableMobileMenuSmall(!enableMobileMenuSmall);
  };

  render() {
    const { active, activeSecondaryMenuMobile } = this.state;
    return (
      <>
        <div className="app-header__mobile-menu">
          <div role="presentation" onClick={this.toggleMobileSidebar}>
            <Slider
              width={26}
              lineHeight={2}
              lineSpacing={5}
              color="#6c757d"
              active={active}
              onClick={() => this.setState({ active })}
            />
          </div>
        </div>
        <div className="app-header__menu">
          <span role="presentation" onClick={this.toggleMobileSmall}>
            <Button
              size="sm"
              className={cx('btn-icon btn-icon-only', {
                active: activeSecondaryMenuMobile,
              })}
              color="primary"
              onClick={() => this.setState({
                activeSecondaryMenuMobile: !activeSecondaryMenuMobile,
              })}
            >
              <div className="btn-icon-wrapper">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            </Button>
          </span>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = (dispatch) => ({
  setEnableMobileMenu: (enable) => dispatch(setEnableMobileMenu(enable)),
  setEnableMobileMenuSmall: (enable) => dispatch(setEnableMobileMenuSmall(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppMobileMenu);

AppMobileMenu.propTypes = {
  enableMobileMenu: PropTypes.bool,
  enableMobileMenuSmall: PropTypes.string,
  setEnableMobileMenu: PropTypes.func.isRequired,
  setEnableMobileMenuSmall: PropTypes.func.isRequired,
};

AppMobileMenu.defaultProps = {
  enableMobileMenu: null,
  enableMobileMenuSmall: null,
};
