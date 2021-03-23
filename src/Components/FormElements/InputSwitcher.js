import { CustomInput } from 'reactstrap';
import React from 'react';
import PropTypes from 'prop-types';
import __ from '../../utils/Translations';

export default function InputSwitcher({
  id, onChange, checked, label, className,
}) {
  const onChangeHandler = (e) => onChange(e.target.checked);
  return (
    <span className={className || 'my-2'}>
      <CustomInput
        inline
        checked={checked}
        className="pt-2"
        type="checkbox"
        id={`${id}_input_switch`}
        onChange={onChangeHandler}
        name={`${id}_input_switch`}
        label={__(label)}
      />
    </span>
  );
}

InputSwitcher.propTypes = {
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

InputSwitcher.defaultProps = {
  label: 'Użyj wartości domyślnej',
  className: null,
};
