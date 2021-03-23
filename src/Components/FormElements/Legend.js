import PropTypes from 'prop-types';
import React from 'react';
import __ from '../../utils/Translations';

const displayLegend = (legend) => {
  switch (legend) {
    case typeof (legend) === 'object':
      return legend.map((item) => (
        <p className="text-center font-weight-normal">{item}</p>
      ));
    case typeof (legend) === 'string':
      return <p>{legend}</p>;
    default:
      return '-';
  }
};

export default function Legend({
  id, title, legend, translateTitle,
}) {
  return (
    <div className="col-sm-12">
      <p id={id}>
        {translateTitle ? __(title) : title}
      </p>
      <div className="col-sm-12">
        {displayLegend(legend)}
      </div>
    </div>
  );
}

Legend.propTypes = {
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  translateTitle: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.string.isRequired,
};

Legend.defaultProps = {
  legend: [],
  translateTitle: true,
  title: 'Legenda:',
};
