import PropTypes from 'prop-types';
import React from 'react';

import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  Col,
  Row,
} from 'reactstrap';

import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DatePicker from 'react-datepicker';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function DateRange({
  value, label, onChange, id, format, errorMessage, validateField, validation, afterLabel, disabled,
}) {
  const inputValue = value || {};
  const errorMessages = errorMessage ? JSON.parse(errorMessage) : null;
  const fromRequired = validation && validation.find((rule) => ['rangeRequiredBoth', 'rangeRequiredFrom'].includes(rule));
  const toRequired = validation && validation.find((rule) => ['rangeRequiredBoth', 'rangeRequiredTo'].includes(rule));
  const errorMessageFrom = errorMessages && errorMessages.from;
  const errorMessageTo = errorMessages && errorMessages.to;

  const handleChange = ({ from, to }) => {
    let fromValue;
    let toValue; if (from === undefined) {
      fromValue = inputValue.from ? new Date(inputValue.from) : '';
    } else {
      fromValue = from;
    }

    if (to === undefined) {
      toValue = inputValue.to ? new Date(inputValue.to) : '';
    } else {
      toValue = to;
    }

    if (toValue && fromValue > toValue) {
      toValue = fromValue;
    }
    if (validateField) {
      if (validation?.find((rule) => rule === 'rangeRequiredBoth')) {
        if (to) {
          validateField(id, {
            to: toValue,
          }, ['rangeRequiredTo']);
        }
        if (from) {
          validateField(id, {
            from: fromValue,
          }, ['rangeRequiredFrom']);
        }
      } else {
        validateField(id, {
          from: fromValue,
          to: toValue,
        }, validation);
      }
    }
    onChange({
      from: fromValue,
      to: toValue,
    });
  };

  const handleChangeStart = (from) => handleChange({ from });
  const handleChangeEnd = (to) => {
    if (to instanceof Date) {
      to.setHours(23);
      to.setMinutes(59);
      to.setSeconds(59);
    }
    handleChange({ to });
  };

  const from = value && value.from ? new Date(value.from) : null;
  const to = value && value.to ? new Date(value.to) : null;

  return (
    <>
      {label ? (
        <Label data-t1={`${id}Label`} for={`${id}`} className="mr-sm-2">
          {label}
        </Label>
      ) : null}
      {afterLabel ? <span className="ml-3">{afterLabel}</span> : null}
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for={`${id}_from`} className="mr-sm-2">
              Od:
              {' '}
              {fromRequired ? <span className="text-danger">*</span> : null}
            </Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
              </InputGroupAddon>
              <div data-t1={`${id}From`}>
                <DatePicker
                  id={`${hashInputId(id)}_from`}
                  popperPlacement="auto"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  selected={from}
                  disabled={disabled}
                  selectsStart
                  className={`form-control${errorMessageFrom ? ' is-invalid' : ''}`}
                  startDate={from}
                  endDate={to}
                  onChange={handleChangeStart}
                  dateFormat={format || 'dd/MM/yyyy'}
                  onBlur={(e) => {
                    if (validateField) {
                      validateField(id, {
                        from: e.target.value,
                        to: inputValue.to,
                      }, validation);
                    }
                  }}
                />
              </div>
              <ValidationMessage message={errorMessageFrom} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for={`${id}_to`} className="mr-sm-2">
              Do:
              {' '}
              {toRequired ? <span className="text-danger">*</span> : null}
            </Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
              </InputGroupAddon>
              <div data-t1={`${id}To`}>
                <DatePicker
                  id={`${hashInputId(id)}_to`}
                  popperPlacement="auto"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  selected={to}
                  disabled={disabled}
                  selectsEnd
                  className={`form-control${errorMessageTo ? ' is-invalid' : ''}`}
                  startDate={from}
                  endDate={to}
                  onChange={handleChangeEnd}
                  dateFormat={format || 'dd/MM/yyyy'}
                  onBlur={(e) => {
                    if (validateField) {
                      validateField(id, {
                        from: inputValue.from,
                        to: e.target.value,
                      }, validation);
                    }
                  }}
                />
              </div>
              <ValidationMessage message={errorMessageTo} />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

DateRange.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  afterLabel: PropTypes.node,
  format: PropTypes.string,
  value: PropTypes.shape({
    from: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    to: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  }),
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

DateRange.defaultProps = {
  id: '',
  label: '',
  onChange: null,
  afterLabel: null,
  disabled: false,
  format: null,
  value: {},
  errorMessage: null,
  validateField: null,
  validation: null,
};
