import PropTypes from 'prop-types';
import React from 'react';
import {
  FormGroup,
  Label,
  Col,
  Row,
  Input,
} from 'reactstrap';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function NumberRange({
  value: fieldValue, label, onChange, id, min, max, errorMessage, validateField, validation, disabled, afterLabel,
}) {
  const value = fieldValue || {};
  const errorMessages = errorMessage ? JSON.parse(errorMessage) : null;
  const fromRequired = validation && validation.find((rule) => ['rangeRequiredBoth', 'rangeRequiredFrom'].includes(rule));
  const toRequired = validation && validation.find((rule) => ['rangeRequiredBoth', 'rangeRequiredTo'].includes(rule));
  const errorMessageFrom = errorMessages && errorMessages.from;
  const errorMessageTo = errorMessages && errorMessages.to;

  const handleChange = ({ from: fromValue, to: toValue }) => {
    let from = fromValue === undefined ? value.from : fromValue;
    let to = toValue === undefined ? value.to : toValue;

    from = from !== '' ? +from : null;
    to = to !== '' ? +to : null;

    if (min !== null) {
      if (from !== null && min > from) {
        from = min;
      }
      if (to !== null && min > to) {
        to = min;
      }
    }
    if (max !== null) {
      if (from !== null && max < from) {
        from = max;
      }
      if (to !== null && max < to) {
        to = max;
      }
    }

    if (to && from > to) {
      to = from;
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
      from,
      to,
    });
  };

  const handleChangeStart = (e) => handleChange({ from: e.target.value });

  const handleChangeEnd = (e) => handleChange({ to: e.target.value });

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
              Od
              {' '}
              {fromRequired ? <span className="text-danger">*</span> : null}
            </Label>
            <Input
              data-t1={`${id}From`}
              id={`${hashInputId(id)}_from`}
              value={value.from || ''}
              onChange={handleChangeStart}
              className={`form-control${errorMessageFrom ? ' is-invalid' : ''}`}
              type="number"
              onBlur={(e) => {
                validateField(id, {
                  from: e.target.value,
                  to: value.to,
                }, validation);
              }}
              disabled={disabled}
            />
            <ValidationMessage message={errorMessageFrom} />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for={`${id}_to`} className="mr-sm-2">
              Do
              {' '}
              {toRequired ? <span className="text-danger">*</span> : null}
            </Label>
            <Input
              data-t1={`${id}From`}
              id={`${id}_to`}
              value={value.to || ''}
              onChange={handleChangeEnd}
              className={`form-control${errorMessageTo ? ' is-invalid' : ''}`}
              type="number"
              onBlur={(e) => {
                validateField(id, {
                  from: value.from,
                  to: e.target.value,
                }, validation);
              }}
              disabled={disabled}
            />
            <ValidationMessage message={errorMessageTo} />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

NumberRange.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  value: PropTypes.shape({
    from: PropTypes.number,
    to: PropTypes.number,
  }),
  disabled: PropTypes.bool,
  afterLabel: PropTypes.node,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

NumberRange.defaultProps = {
  id: '',
  label: '',
  max: null,
  min: null,
  value: {},
  disabled: false,
  afterLabel: null,
  errorMessage: '',
  validateField: '',
  validation: '',
};
