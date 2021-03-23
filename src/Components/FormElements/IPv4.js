import PropTypes from 'prop-types';
import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  InputGroupText,
  Input, Row, Col,

} from 'reactstrap';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function IPv4({
  id, label, validation, placeholder, value, prefix, suffix, validateField, tooltip,
  errorMessage, onChange, tooltipPosition, inputSwitcher, disabled,
}) {
  const input = (
    <Input
      data-t1={id}
      type="text"
      minLength="7"
      maxLength="15"
      onChange={onChange}
      id={hashInputId(id)}
      name={hashInputId(id)}
      disabled={disabled}
      autoComplete="chrome-off"
      size="15"
      placeholder={placeholder}
      invalid={Boolean(errorMessage)}
      onBlur={(e) => {
        validateField(id, e.target.value, validation);
      }}
      value={value || ''}
    />
  );
  const inputGroup = (
    <InputGroup>
      {prefix ? (
        <InputGroupAddon addonType="prepend">
          <InputGroupText>{prefix}</InputGroupText>
        </InputGroupAddon>
      ) : null}
      {input}
      {suffix ? (
        <InputGroupAddon addonType="append">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      ) : null}
      {tooltip && tooltipPosition === 'input' ? (
        <InputGroupAddon addonType="append">
          <InputGroupText>{tooltip}</InputGroupText>
        </InputGroupAddon>
      ) : null}
      <ValidationMessage message={errorMessage} />
    </InputGroup>
  );

  return (
    <FormGroup>
      <Label data-t1={`${id}Label`} for={id}>
        {label}
        {tooltip && tooltipPosition === 'label' ? (
          <>
            {' '}
            {tooltip}
          </>
        ) : null}
      </Label>
      {inputSwitcher ? (
        <Row>
          <Col sm={9}>
            {inputGroup}
          </Col>
          <Col sm={3}>
            {inputSwitcher}
          </Col>
        </Row>
      ) : inputGroup}
    </FormGroup>
  );
}

IPv4.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  inputSwitcher: PropTypes.node,
  disabled: PropTypes.bool,
  tooltipPosition: PropTypes.string,
  value: PropTypes.string,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

IPv4.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  tooltipPosition: 'label',
  inputSwitcher: null,
  disabled: false,
  value: '',
  errorMessage: null,
  validateField: null,
  validation: null,
  placeholder: '',
  prefix: '',
  suffix: '',
};
