import React from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

export default function TwoColumns({
  children, sm, md, lg,
}) {
  const result = [];
  for (let i = 0; i < children.length; i += 2) {
    const el1 = children[i];
    const el2 = children[i + 1];
    result.push(
      <Row key={i}>
        <Col sm={Array.isArray(sm) ? sm[0] : sm} md={Array.isArray(md) ? md[0] : md} lg={Array.isArray(lg) ? lg[0] : lg}>{el1}</Col>
        <Col sm={Array.isArray(sm) ? sm[1] : sm} md={Array.isArray(md) ? md[1] : md} lg={Array.isArray(lg) ? lg[1] : lg}>{el2}</Col>
      </Row>,
    );
  }

  return result;
}

TwoColumns.propTypes = {
  children: PropTypes.node.isRequired,
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
};

TwoColumns.defaultProps = {
  lg: null,
  md: null,
  sm: null,
};
