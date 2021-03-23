import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

export default function Tiles({
  config, onTileClick, selected, md, sm,
}) {
  return (
    <div className="grid-menu grid-menu-4col">
      <Row className="no-gutters" data-t1="tiles">
        {config.map(({
          label, icon, id,
        }) => {
          const isSelected = Array.isArray(selected) ? selected.includes(id) : selected === id;
          return (
            <Col md={md} sm={sm} className={`bg-white${isSelected ? ' border-success' : ''}`} key={id}>
              <div
                className={`widget-chart widget-chart-hover ${isSelected ? 'text-success' : 'text-primary'}`}
                role="presentation"
                data-t1={id}
                onClick={onTileClick ? () => onTileClick(id) : null}
              >
                <div className="icon-wrapper rounded-circle">
                  <div className="icon-wrapper-bg bg-primary" />
                  <i className={`${icon}`} />
                </div>
                <div className="widget-numbers-sm">{label}</div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
Tiles.propTypes = {
  config: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onTileClick: PropTypes.func,
  md: PropTypes.string,
  sm: PropTypes.string,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
};

Tiles.defaultProps = {
  onTileClick: null,
  selected: null,
  md: '3',
  sm: '6',
};
