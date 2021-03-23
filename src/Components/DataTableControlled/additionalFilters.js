import PropTypes from 'prop-types';
import React from 'react';
import { Label, Row, Col } from 'reactstrap';
import __ from '../../utils/Translations';
import Text from './AdditionalFiltersInput/Text';
import Select from './AdditionalFiltersInput/Select';

export default function AdditionalFilters({
  filtersConfig, onFilteredChange, currentFilters,
}) {
  const onUpdate = (key, value) => {
    const newFilters = [...currentFilters];
    const valueObject = currentFilters.find((el) => el.id === key);
    if (valueObject) {
      valueObject.value = value;
    } else {
      newFilters.push({ id: key, value });
    }
    onFilteredChange(newFilters);
  };

  return (
    <Row>
      {filtersConfig.map(({
        label, id, type, options,
      }) => {
        const valueObject = currentFilters.find((el) => el.id === id);
        const value = valueObject ? valueObject.value : '';

        let component;
        switch (type) {
          case 'select':
            component = <Select id={id} value={value} options={options} onUpdate={onUpdate} />;
            break;
          case 'text':
          default:
            component = <Text id={id} value={value} onUpdate={onUpdate} />;
        }
        return (
          <Col key={id} sm={2} className="mb-2">
            <Label>
              {__(label)}
              :
            </Label>
            {' '}
            {component}
          </Col>
        );
      })}
    </Row>
  );
}

AdditionalFilters.propTypes = {
  filtersConfig: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.oneOf(['text', 'select']),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
  })).isRequired,
  onFilteredChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
};
