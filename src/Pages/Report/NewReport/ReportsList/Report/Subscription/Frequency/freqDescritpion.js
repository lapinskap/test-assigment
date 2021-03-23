import React from 'react';
import PropTypes from 'prop-types';

const FreqDescription = ({ info }) => (
  <div className="row subscription-info">
    <div className="col-md-12">
      Występuje:
      {' '}
      <text className="subscription-info-annotation">{info}</text>
    </div>
  </div>
);

export default FreqDescription;

FreqDescription.propTypes = {
  info: PropTypes.string.isRequired,
};
