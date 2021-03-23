import PropTypes from 'prop-types';
import React from 'react';
import { Label, Row, Col } from 'reactstrap';
import Select from 'react-select';
import ValidationMessage from '../../Form/ValidationMessage';
import __ from '../../../utils/Translations';

export default function Autocomplete({
  value, label, onChange, id, errorMessage, validateField, validation, options, tooltip, inputSwitcher, disabled,
  isMultiselect, placeholder, classNamePrefix,
}) {
  let selectValue;
  if (isMultiselect) {
    if (Array.isArray(value)) {
      selectValue = value.map((item) => options.reduce((result, option) => findSelectedOption(result, option, item, isMultiselect), null));
    } else {
      selectValue = [];
    }
  } else {
    selectValue = options.reduce((result, option) => findSelectedOption(result, option, value, isMultiselect), null);
  }
  const inputGroup = (
    <div className="input-group-omb" data-t1={id}>
      <Select
        isMulti={isMultiselect}
        isClearable
        className="omb-autocomplete"
        id={id}
        classNamePrefix={classNamePrefix}
        hideSelectedOptions={false}
        noOptionsMessage={() => __('Brak opcji')}
        value={selectValue}
        isDisabled={disabled}
        placeholder={placeholder || __('Wybierz...')}
        options={options}
        styles={errorMessage ? errorStyles : defaultStyles}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(option) => {
          onChange(option);
          validateField(id, (isMultiselect ? option : option?.value), validation);
        }}
        onBlur={() => {
          if (validateField) {
            validateField(id, value, validation);
          }
        }}
      />
      <ValidationMessage message={errorMessage} />
    </div>
  );
  return (
    <>
      {label ? (
        <Label data-t1={`${id}Label`} for={id} className="mr-sm-2">
          {label}
          {tooltip ? (
            <>
              {' '}
              {tooltip}
            </>
          ) : null}
        </Label>
      ) : null}
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
    </>
  );
}

export const findSelectedOption = (result, option, value) => {
  if (!result) {
    if (Array.isArray(option.options)) {
      const item = option.options.reduce((subResult, subOption) => findSelectedOption(subResult, subOption, value), result);
      return item || result;
    }
    return option.value === value ? option : result;
  }
  return result;
};

export const defaultStyles = {
  menu: (provided) => ({ ...provided, zIndex: 100 }),
};

export const errorStyles = {
  ...defaultStyles,
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#ddd' : 'red',
    '&:hover': {
      borderColor: state.isFocused ? '#ddd' : 'red',
    },
  }),
};

Autocomplete.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  tooltip: PropTypes.node,
  inputSwitcher: PropTypes.node,
  disabled: PropTypes.bool,
  isMultiselect: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
  classNamePrefix: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
  options: PropTypes.arrayOf(PropTypes.shape({
    isDisabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      isDisabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })),
  })).isRequired,
};

Autocomplete.defaultProps = {
  id: '',
  label: '',
  value: '',
  errorMessage: '',
  inputSwitcher: null,
  classNamePrefix: null,
  disabled: false,
  isMultiselect: false,
  tooltip: null,
  placeholder: null,
  validateField: () => {
  },
  validation: [],
};
