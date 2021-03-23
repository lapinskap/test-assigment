import PropTypes from 'prop-types';
import React from 'react';

import {
  Input,
  FormGroup,
  Label,
  Form,
  Col,
  Row,
} from 'reactstrap';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function DateTimePicker({
  value: fieldValue,
  label,
  onChange,
  id,
  tooltip,
  dateFormat,
  errorMessage,
  validateField,
  validation,
  disabled,
  afterLabel,
}) {
  const value = fieldValue || {};
  const errorMessages = errorMessage ? JSON.parse(errorMessage) : null;
  const required = validation && validation.find((rule) => rule === 'datetimeRequired');
  const errorMessageDate = errorMessages && errorMessages.date;
  const errorMessageTime = errorMessages && errorMessages.time;

  const handleChange = ({ date: dateValue, time: timeValue }) => {
    const date = dateValue === undefined ? value.date : dateValue;
    const time = timeValue === undefined ? value.time : timeValue;

    validateField(id, { date, time }, validation);
    onChange({ date, time });
  };

  const handleChangeDate = (e) => handleChange({ date: e.target.value });
  const handleChangeTime = (e) => handleChange({ time: e.target.value });
  return (
    <>
      <Form>
        <Label data-t1={`${id}Label`} for={`${id}`} className="mr-sm-2">
          {label}
          {' '}
          {required ? <span className="text-danger">*</span> : null}
&nbsp;
          {tooltip}
        </Label>
        {afterLabel ? <span className="ml-3">{afterLabel}</span> : null}
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Input
                value={value.date}
                onChange={handleChangeDate}
                type="date"
                id={hashInputId(id)}
                disabled={disabled}
                dateFormat={dateFormat || 'dd/MM/yyyy'}
                invalid={Boolean(errorMessageDate)}
              />
              <ValidationMessage message={errorMessageDate} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Input value={value.time} onChange={handleChangeTime} type="time" invalid={Boolean(errorMessageTime)} disabled={disabled} />
              <ValidationMessage message={errorMessageTime} />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </>
  );
}

DateTimePicker.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  dateFormat: PropTypes.string,
  value: PropTypes.shape({
    date: PropTypes.PropTypes.instanceOf(Date),
    time: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  afterLabel: PropTypes.node,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

DateTimePicker.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  dateFormat: null,
  disabled: false,
  afterLabel: null,
  value: {},
  errorMessage: null,
  validateField: null,
  validation: null,
};
