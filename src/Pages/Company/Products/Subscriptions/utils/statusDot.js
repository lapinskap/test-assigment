import React from 'react';
import PropTypes from 'prop-types';

export default function StatusDot({ background }) {
  return (
    <div className="dot" style={{ backgroundColor: background }} />
  );
}

StatusDot.propTypes = {
  background: PropTypes.string,
};

StatusDot.defaultProps = {
  background: 'green',
};
