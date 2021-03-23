import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

export default function Select({
  id, value, onUpdate, options,
}) {
  const onChange = (e) => onUpdate(id, e.target.value);

  return (
    <Input
      data-t1="gridFilter"
      data-t2={id}
      type="select"
      id={id}
      value={value}
      onChange={onChange}
    >
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <option
          key={optionValue}
          value={optionValue}
        >
          {optionLabel || optionValue}
        </option>
      ))}
    </Input>
  );
}
Select.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
};
