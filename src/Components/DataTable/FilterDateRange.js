import PropTypes from 'prop-types';
import React from 'react';

import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Row,
} from 'reactstrap';

import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DatePicker from 'react-datepicker';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function FilterDateRange({
  value, onChange, id, showTimeSelect,
}) {
  const inputValue = value;

  const handleChange = ({ from, to }) => {
    const fromValue = from === undefined ? inputValue.from : from;
    let toValue = to === undefined ? inputValue.to : to;

    if (toValue && fromValue > toValue) {
      toValue = fromValue;
    }
    onChange({
      from: fromValue,
      to: toValue,
    });
  };

  const handleChangeStart = (from) => handleChange({ from });
  const handleChangeEnd = (to) => {
    let newValue = to;
    if (!showTimeSelect && newValue) {
      newValue = new Date(newValue);
      newValue.setHours(23);
      newValue.setMinutes(59);
      newValue.setSeconds(59);
    }
    return handleChange({ to: newValue });
  };

  const from = value && value.from ? new Date(value.from) : null;
  const to = value && value.to ? new Date(value.to) : null;

  return (
    <>
      <Row form>
        <div style={{ width: '47.5%' }}>
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
              </InputGroupAddon>
              <div
                className={`m-0 p-0 ${showTimeSelect ? 'datetime-picker-wrapper' : 'date-picker-wrapper'}`}
                data-t1="gridFilter"
                data-t2={`${id}From`}
              >
                <DatePicker
                  id={`${hashInputId(id)}_from`}
                  popperPlacement="auto"
                  popperClassName="some-custom-class"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  selected={from}
                  placeholderText="od"
                  selectsStart
                  showTimeSelect={showTimeSelect}
                  className="form-control"
                  startDate={from}
                  endDate={to}
                  onChange={handleChangeStart}
                  dateFormat={showTimeSelect ? 'dd/MM/yyyy H:mm' : 'dd/MM/yyyy'}
                />
              </div>
            </InputGroup>
          </FormGroup>
        </div>
        <p style={{ width: '5%' }}>
          -
        </p>
        <div style={{ width: '47.5%' }}>
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
              </InputGroupAddon>
              <div
                className={`m-0 p-0 ${showTimeSelect ? 'datetime-picker-wrapper' : 'date-picker-wrapper'}`}
                data-t1="gridFilter"
                data-t2={`${id}To`}
              >
                <DatePicker
                  id={`${hashInputId(id)}_to`}
                  popperPlacement="auto"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  selected={to}
                  showTimeSelect={showTimeSelect}
                  placeholderText="do"
                  selectsEnd
                  className="form-control"
                  startDate={from}
                  endDate={to}
                  onChange={handleChangeEnd}
                  timeFormat="HH:mm"
                  dateFormat={showTimeSelect ? 'dd/MM/yyyy HH:mm aa' : 'dd/MM/yyyy'}
                />
              </div>
            </InputGroup>
          </FormGroup>
        </div>
      </Row>
    </>
  );
}

FilterDateRange.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  showTimeSelect: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    from: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    to: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  }),
};

FilterDateRange.defaultProps = {
  id: '',
  onChange: null,
  value: {},
};
