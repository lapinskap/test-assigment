import {
  Input, InputGroup,
} from 'reactstrap';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';
import { FIELD_TYPES_CONFIG } from '../../../utils/consts';
import __ from '../../../../../../utils/Translations';
import { getErrorForFormField } from '../../validation';
import ValidationMessage from '../../../../../../Components/Form/ValidationMessage';

export const LabelColumn = ({
  column, original: data, index, columnProps,
}) => {
  const {
    updateRow, errors, validateFormField, sectionId, isDefaultLanguage,
  } = columnProps.rest;
  const value = data[column.id] || '';
  const validate = isDefaultLanguage;
  const error = validate ? getErrorForFormField(errors, sectionId, data.id, 'label') : null;
  const ref = useRef(null);
  useEffect(() => {
    const input = ref.current;
    input.addEventListener('keydown', delaySubmit);
    return () => {
      input.removeEventListener('keydown', delaySubmit);
    };
  }, []);
  return (
    <div className="d-block w-100 text-center">
      {!isDefaultLanguage ? getOriginalValue(data.labelOriginal) : null}
      <InputGroup>
        <Input
          innerRef={ref}
          value={value}
          type="text"
          invalid={Boolean(error)}
          onChange={(e) => {
            const { value: inputValue } = e.target;
            const updatedRow = { ...data };
            updatedRow[column.id] = inputValue;
            updateRow(index, updatedRow);
            if (validate) {
              validateFormField(sectionId, data.id, 'label', inputValue);
            }
          }}
        />
        <ValidationMessage message={error} />
      </InputGroup>
    </div>
  );
};

LabelColumn.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  original: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.shape({
    rest: PropTypes.shape({
      updateRow: PropTypes.func,
      validateFormField: PropTypes.func,
      sectionId: PropTypes.string,
      errors: PropTypes.shape({}),
      isDefaultLanguage: PropTypes.bool,
    }),
  }).isRequired,
};

export const TooltipColumn = ({
  column, original: data, index, columnProps,
}) => {
  const {
    updateRow, isDefaultLanguage,
  } = columnProps.rest;
  const value = data[column.id] || '';
  return (
    <div className="d-block w-100 text-center">
      {!isDefaultLanguage ? getOriginalValue(data.tooltipOriginal) : null}
      <InputGroup>
        <Input
          defaultValue={value}
          type="textarea"
          onChange={(e) => {
            const updatedRow = { ...data };
            updatedRow[column.id] = e.target.value;
            updateRow(index, updatedRow);
          }}
        />
      </InputGroup>
    </div>
  );
};

TooltipColumn.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  original: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.shape({
    rest: PropTypes.shape({
      updateRow: PropTypes.func,
      isDefaultLanguage: PropTypes.bool,
    }),
  }).isRequired,
};

export const IsRequiredColumn = ({
  column, original: data, index, columnProps,
}) => {
  const {
    updateRow, isDisabled, options,
  } = columnProps.rest;
  const value = data[column.id] || false;
  const depends = data.requirementDependency;
  if (depends) {
    const { label: dependencyLabel = depends } = options.find(({ value: fieldId }) => fieldId === depends) || {};
    return <span>{__('Obowiązkowość zależna od pola o ID {0}', [dependencyLabel])}</span>;
  }

  return (
    <div className="d-block w-100 text-center">
      <ToggleSwitch
        disabled={isDisabled}
        checked={value}
        handleChange={(checked) => {
          const updatedRow = { ...data };
          updatedRow[column.id] = checked;
          updateRow(index, updatedRow);
        }}
      />
    </div>
  );
};

IsRequiredColumn.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  original: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.shape({
    rest: PropTypes.shape({
      updateRow: PropTypes.func,
      isDisabled: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })),
    }),
  }).isRequired,
};

export const TypeColumn = ({
  column, original: data, index, columnProps,
}) => {
  const {
    updateRow, isDisabled,
  } = columnProps.rest;
  const currentValue = data[column.id] || '';
  return (
    <select
      disabled={isDisabled}
      value={currentValue}
      id={column.id}
      className="form-control"
      name={column.id}
      onChange={(e) => {
        const newValue = e.target.value;
        const updatedRow = { ...data };
        updatedRow[column.id] = newValue;

        const typeConfig = FIELD_TYPES_CONFIG.find(({ code }) => code === newValue);
        if (typeConfig?.defaultLabel && !updatedRow.label) {
          updatedRow.label = typeConfig.defaultLabel;
        }
        updateRow(index, updatedRow);
      }}
    >
      {FIELD_TYPES_CONFIG.map(({ name, code }) => <option key={code} value={code}>{name}</option>)}
    </select>
  );
};
TypeColumn.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  original: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.shape({
    rest: PropTypes.shape({
      updateRow: PropTypes.func,
      isDisabled: PropTypes.bool,
    }),
  }).isRequired,
};

export const RequirementDependencyColumn = ({
  column, original: data, index, columnProps,
}) => {
  const {
    updateRow, isDisabled, options,
  } = columnProps.rest;
  const currentValue = data[column.id] || '';
  const currentId = data.id;
  return (
    <select
      disabled={isDisabled}
      value={currentValue}
      id={column.id}
      className="form-control"
      name={column.id}
      onChange={(e) => {
        const newValue = e.target.value;
        const updatedRow = { ...data };
        updatedRow[column.id] = newValue;
        updateRow(index, updatedRow);
      }}
    >
      <option value={null}>{ }</option>
      {options.map(({ value, label }) => (value !== currentId ? <option key={value} value={value}>{label}</option> : null))}
    </select>
  );
};

RequirementDependencyColumn.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  original: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.shape({
    rest: PropTypes.shape({
      updateRow: PropTypes.func,
      isDisabled: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })),
    }),
  }).isRequired,
};

const delaySubmit = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();
    const form = e.target.closest('form');
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      e.target.blur();
      setTimeout(() => {
        submitButton.click();
      }, 10);
    }
  }
};

const getOriginalValue = (originalValue) => {
  if (!originalValue) {
    return null;
  }
  let originalValueText = originalValue;
  if (originalValueText.length > 32) {
    originalValueText = `${originalValue.slice(0, 29)}...`;
  }
  return <div title={originalValue} style={{ marginTop: '-20px' }}>{originalValueText}</div>;
};
