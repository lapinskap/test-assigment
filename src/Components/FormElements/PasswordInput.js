import React, { useState } from 'react';
import {
  Input, Label, InputGroup, FormGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import ValidationMessage from '../Form/ValidationMessage';
import hashInputId from '../../utils/jsHelpers/hashInputId';

export default function PasswordInput({
  id, label, value, disabled, onChange, tooltip, errorMessage, validateField, validation, className, previewToggle,
}) {
  const [visible, setVisible] = useState(false);

  const updateFunction = (e) => {
    const { value: newValue } = e.target;
    if (errorMessage && validation) {
      validateField(id, newValue, validation);
    }
    onChange(id, newValue);
  };

  const inputClassNames = [];
  if (!visible) {
    inputClassNames.push('password-hidden-input');
  }
  if (className) {
    inputClassNames.push(className);
  }
  return (
    <FormGroup>
      {label ? (
        <Label for={id}>
          {label}
          {' '}
          {tooltip}
        </Label>
      ) : null}
      <InputGroup>
        <div className="password-input-wrapper">
          <Input
            invalid={Boolean(errorMessage)}
            type="text"
            name={hashInputId(id)}
            onBlur={(e) => {
              validateField(id, e.target.value, validation);
            }}
            data-t1={id}
            id={hashInputId(id)}
            value={value || ''}
            onChange={updateFunction}
            disabled={disabled}
            className={inputClassNames.join(' ')}
            autoComplete="false"
          />
          {previewToggle ? (
            <FontAwesomeIcon
              className="password-input-eye"
              icon={visible ? faEyeSlash : faEye}
              onClick={() => setVisible(!visible)}
            />
          ) : null}
        </div>
        <ValidationMessage message={errorMessage} />
      </InputGroup>
    </FormGroup>
  );
}
PasswordInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  value: PropTypes.string,
  previewToggle: PropTypes.bool,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

PasswordInput.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  value: '',
  errorMessage: '',
  disabled: false,
  previewToggle: true,
  className: '',
  validateField: () => {},
  validation: [],
};
