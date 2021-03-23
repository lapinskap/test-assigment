import { Input } from 'reactstrap';
import React from 'react';
import PropTypes from 'prop-types';

export default function Text({
  id, value, onUpdate,
}) {
  const onChange = (e) => onUpdate(id, e.target.value);
  return (
    <Input
      data-t1="gridFilter"
      data-t2={id}
      type="text"
      id={id}
      value={value}
      onChange={onChange}
    />
  );
}
Text.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
