import PropTypes from 'prop-types';
import React from 'react';
import {
  Row, Col, Button,
} from 'reactstrap';
import monthsOptions from '../../../../../utils/constants/months';
import monthDaysOptions from '../../../../../utils/constants/monthDays';
import __ from '../../../../../utils/Translations';
import ValidationMessage from '../../../../../Components/Form/ValidationMessage';

export default function PeriodicModeForm({
  days, months, onChange, errorMessage, validateField, disabled,
}) {
  const updateMonths = (value, checked) => {
    let newValue = [];
    if (checked) {
      if (!months.includes(value)) {
        newValue = [...months, value];
        onChange('periodicallyMonths', newValue);
      }
    } else {
      newValue = months.filter((el) => el !== value);
      onChange('periodicallyMonths', newValue);
    }
    validateField('periodicallyMonths', newValue.length ? null : __('To pole jest wymagane'));
  };
  const updateDays = (value, checked) => {
    let newValue = [];
    if (checked) {
      if (!days.includes(value)) {
        newValue = [...days, value];
        onChange('periodicallyDays', newValue);
      }
    } else {
      newValue = days.filter((el) => el !== value);
      onChange('periodicallyDays', newValue);
    }
  };
  return (
    <Row className="input-group-omb mb-3">
      <div className="ml-3 mr-3 pl-3 pr-3">
        <div>
          Miesiące:
          <span className="text-danger">*</span>
        </div>
        <Row style={{ width: '300px' }} className="form-action" data-t1="periodicallyMonths">
          {monthsOptions.map(({ label, value }) => {
            const isSelected = months.includes(value);
            return (
              <Col md={4} sm={6} key={value}>
                <Button
                  data-t1="monthButton"
                  data-t2={value}
                  type="button"
                  disabled={disabled}
                  className="btn-square"
                  onClick={() => updateMonths(value, !isSelected)}
                  color={isSelected ? 'primary' : 'light'}
                  style={{ minWidth: '100px' }}
                >
                  {__(label)}
                </Button>
              </Col>
            );
          })}
        </Row>
        <ValidationMessage message={errorMessage} />
      </div>
      <div className="ml-3 mr-3 pl-3 pr-3">
        <div>Dni:</div>
        <Row style={{ width: '360px' }} data-t1="periodicallyDays">
          {monthDaysOptions.map(({ value }) => {
            const isSelected = days.includes(value);
            return (
              <Col md={2} key={value}>
                <Button
                  data-t1="dayButton"
                  data-t2={value}
                  type="button"
                  disabled={disabled}
                  className="btn-square"
                  onClick={() => updateDays(value, !isSelected)}
                  color={isSelected ? 'primary' : 'light'}
                  style={{ width: '60px' }}
                >
                  {value}
                </Button>
              </Col>
            );
          })}
        </Row>
      </div>
    </Row>
  );
}

PeriodicModeForm.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string),
  months: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

PeriodicModeForm.defaultProps = {
  days: [],
  months: [],
  errorMessage: null,
  disabled: false,
};
