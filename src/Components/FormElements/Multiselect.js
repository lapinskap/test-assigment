import PropTypes from 'prop-types';
import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  InputGroupText,
  Input,

} from 'reactstrap';
import ValidationMessage from '../Form/ValidationMessage';
import __ from '../../utils/Translations';

export default function Multiselect({
  id, label, validation, invalid, value, prefix, suffix, validateField, tooltip, errorMessage, onChange, options, disabled, afterLabel,
}) {
  const inputOptions = options.map(
    ({ value: optionValue, label: optionLabel }) => (
      <option
        key={optionValue}
        value={optionValue}
      >
        {optionLabel ? __(optionLabel) : optionValue}
      </option>
    ),
  );

  return (
    <FormGroup>
      <Label data-t1={`${id}Label`} for={id}>
        {label}
        &nbsp;
        {tooltip}
      </Label>
      {afterLabel ? <span className="ml-3">{afterLabel}</span> : null}
      <InputGroup>
        {prefix ? (
          <InputGroupAddon addonType="prepend">
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
        <Input
          data-t1={id}
          type="select"
          onChange={onChange}
          id={id}
          disabled={disabled}
          name={id}
          invalid={invalid}
          onBlur={(e) => {
            if (validateField) {
              validateField(id, e.target.value, validation);
            }
          }}
          multiple
          value={value || []}
        >
          {inputOptions}
        </Input>
        <ValidationMessage message={errorMessage} />
        {suffix ? (
          <InputGroupAddon addonType="append">
            <InputGroupText>{suffix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </FormGroup>
  );
}

Multiselect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  disabled: PropTypes.bool,
  afterLabel: PropTypes.node,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  invalid: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  })).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

Multiselect.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  afterLabel: null,
  value: [],
  errorMessage: null,
  validateField: null,
  validation: null,
  prefix: '',
  suffix: '',
  invalid: false,
  disabled: false,
};
