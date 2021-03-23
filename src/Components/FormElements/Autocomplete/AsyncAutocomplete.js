import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Col,
  Label, Row,
} from 'reactstrap';
import { Async as AsyncSelect } from 'react-select';
import ValidationMessage from '../../Form/ValidationMessage';
import { defaultStyles, errorStyles, findSelectedOption } from './Autocomplete';
import __ from '../../../utils/Translations';

export default function AsyncAutocomplete({
  value, label, onChange, id, errorMessage, validateField, validation, fetchOptions, tooltip, inputSwitcher, disabled, isMultiselect, placeholder,
}) {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
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
      <AsyncSelect
        key={`${id}_autocomplete-${value}`}
        isClearable
        className="omb-autocomplete"
        isDisabled={disabled}
        isMulti={isMultiselect}
        noOptionsMessage={() => __('Brak opcji')}
        hideSelectedOptions={false}
        cacheOptions
        defaultOptions
        loadOptions={async (inputValue, callback) => {
          if ((inputValue && inputValue.length > 1) || (!inputValue && value)) {
            const newOptions = await fetchOptions(inputValue);
            setOptions(newOptions);
            callback(newOptions);
          } else {
            setOptions([]);
            callback([]);
          }
        }}
        id={id}
        defaultInputValue={searchValue}
        onInputChange={(query) => setSearchValue(query)}
        value={selectValue}
        styles={errorMessage ? errorStyles : defaultStyles}
        onChange={(option) => {
          onChange(option);
          validateField(id, option ? option.value : null, validation);
        }}
        placeholder={placeholder || __('Wybierz...')}
        onKeyDown={(e) => e.stopPropagation()}
        onBlur={async () => {
          if (!searchValue) {
            setOptions(await fetchOptions());
          }
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

AsyncAutocomplete.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  tooltip: PropTypes.node,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
  validateField: PropTypes.func,
  inputSwitcher: PropTypes.node,
  disabled: PropTypes.bool,
  isMultiselect: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
  fetchOptions: PropTypes.func.isRequired,
};

AsyncAutocomplete.defaultProps = {
  id: '',
  label: '',
  value: '',
  errorMessage: '',
  inputSwitcher: null,
  disabled: false,
  isMultiselect: false,
  tooltip: null,
  placeholder: null,
  validateField: () => {},
  validation: [],
};
