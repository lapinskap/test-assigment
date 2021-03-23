import PropTypes from 'prop-types';
import React from 'react';

import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label, InputGroupText, Row, Col,

} from 'reactstrap';

import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DatePickerRc from 'react-datepicker';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';
import __ from '../../utils/Translations';

export default function DataPicker({
  label, id, value, onChange, tooltip, format, errorMessage, validateField, validation, tooltipPosition, inputSwitcher,
  disabled, showTimeSelect,
}) {
  const onValueChanged = (newValue) => {
    if (newValue instanceof Date && !showTimeSelect) {
      newValue.setHours(0);
      newValue.setMinutes(0);
      newValue.setSeconds(0);
    }
    validateField(id, newValue, validation);
    onChange(newValue);
  };

  const inputGroup = (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <div className="input-group-text">
          <FontAwesomeIcon icon={faCalendarAlt} />
        </div>
      </InputGroupAddon>
      <div data-t1={id} className={`${showTimeSelect ? 'datetime-picker-wrapper' : 'date-picker-wrapper'}`}>
        <DatePickerRc
          id={hashInputId(id)}
          selected={value ? new Date(value) : null}
          selectsStart
          disabled={disabled}
          className={`form-control${errorMessage ? ' is-invalid' : ''}`}
          invalid={Boolean(errorMessage)}
          onBlur={(e) => validateField(id, e.target.value, validation)}
          onChange={onValueChanged}
          popperPlacement="auto"
          showTimeSelect={showTimeSelect}
          dateFormat={showTimeSelect ? 'dd/MM/yyyy H:mm' : (format || 'dd/MM/yyyy')}
          timeCaption={__('Godzina:')}
        />
      </div>
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
      <Label data-t1={`${id}Label`} for={id} className="mr-sm-2">
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

DataPicker.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string,
  showTimeSelect: PropTypes.bool,
  tooltip: PropTypes.node,
  inputSwitcher: PropTypes.node,
  disabled: PropTypes.bool,
  tooltipPosition: PropTypes.string,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
};

DataPicker.defaultProps = {
  id: '',
  label: '',
  format: '',
  showTimeSelect: false,
  tooltip: null,
  inputSwitcher: null,
  disabled: false,
  tooltipPosition: 'label',
  errorMessage: null,
  validateField: null,
  validation: null,
  value: PropTypes.instanceOf(Date),
};
