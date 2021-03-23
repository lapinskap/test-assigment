import PropTypes from 'prop-types';
import React from 'react';

export default function ValidationMessage({ message }) {
  return message ? <div className="invalid-feedback" style={{ display: 'block' }}>{message}</div> : null;
}

ValidationMessage.propTypes = {
  message: PropTypes.string,
};

ValidationMessage.defaultProps = {
  message: '',
};
