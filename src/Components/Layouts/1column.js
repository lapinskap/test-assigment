import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

export default function OneColumns({
  children, sm, md, lg,
}) {
  const result = [];
  for (let i = 0; i < children.length; i += 1) {
    const el = children[i];
    result.push(
      <Row key={i}>
        <Col sm={Array.isArray(sm) ? sm[0] : sm} md={Array.isArray(md) ? md[0] : md} lg={Array.isArray(lg) ? lg[0] : lg}>
          {el}
        </Col>
      </Row>,
    );
  }

  return result;
}

OneColumns.propTypes = {
  children: PropTypes.node.isRequired,
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
};

OneColumns.defaultProps = {
  lg: null,
  md: null,
  sm: null,
};
