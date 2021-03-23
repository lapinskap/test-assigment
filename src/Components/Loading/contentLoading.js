import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-advanced';
import { Loader as LoaderAnim } from 'react-loaders';

const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;

export default function ContentLoading({
  children, message, useBlur, show, messageStyle, backgroundStyle,
}) {
  return (
    <Loader
      message={message}
      contentBlur={useBlur ? 4 : 0}
      show={show}
      messageStyle={messageStyle}
      backgroundStyle={backgroundStyle}
    >
      {children}
    </Loader>
  );
}

ContentLoading.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  backgroundStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  // eslint-disable-next-line react/forbid-prop-types
  messageStyle: PropTypes.object,
  show: PropTypes.bool.isRequired,
  useBlur: PropTypes.bool,
};

ContentLoading.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  backgroundStyle: null,
  message: spinner,
  messageStyle: {},
  useBlur: true,
};
