import PropTypes from 'prop-types';
import React from 'react';
import { CardHeader } from 'reactstrap';
import Sticky from 'react-stickynode';
import __ from '../../utils/Translations';

export default function FormTitle({
  stickyTitle, title, buttons, translateTitle,
}) {
  return (
    <Sticky enabled={stickyTitle} top=".app-header" activeClass="sticky-active-class">
      <CardHeader className="card-header-lg text-transform-none">
        <div className="card-header-title font-size-lg font-weight-normal">
          {translateTitle ? __(title) : title}
        </div>
        <div className="btn-actions-pane-right">
          {buttons}
        </div>
      </CardHeader>
    </Sticky>
  );
}

FormTitle.propTypes = {
  buttons: PropTypes.node,
  stickyTitle: PropTypes.bool,
  translateTitle: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

FormTitle.defaultProps = {
  buttons: [],
  stickyTitle: false,
  translateTitle: true,
  title: '',
};
