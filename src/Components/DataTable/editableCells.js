import React from 'react';
import {
  CustomInput, Input, InputGroup, InputGroupAddon, InputGroupText,
} from 'reactstrap';
import ToggleSwitch from '../FormElements/ToggleSwitch';
import DynamicTranslationTrigger from '../DynamicTranslation/DynamicTranslationTrigger';

export const getEditableCell = (data, updateData, type = 'text', disableDependsOn = null, translatableScope = null) => {
  const renderEditable = (cellInfo) => {
    const value = data[cellInfo.index][cellInfo.column.id];
    return (
      <div className="d-block w-100 text-center">
        <InputGroup>
          <Input
            defaultValue={value}
            type={type}
            disabled={disableDependsOn ? disableDependsOn(cellInfo) : false}
            onBlur={(e) => {
              const updatedData = [...data];
              updatedData[cellInfo.index][cellInfo.column.id] = e.target.value;
              updateData(updatedData);
            }}
          />
          {translatableScope && value ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <DynamicTranslationTrigger
                  scope={translatableScope}
                  value={value}
                />
              </InputGroupText>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>
    );
  };
  return renderEditable;
};

export const getToggleSwitchCell = (data, updateData) => {
  const renderEditable = (cellInfo) => (
    <div className="d-block w-100 text-center">
      <ToggleSwitch
        checked={Boolean(data[cellInfo.index][cellInfo.column.id])}
        handleChange={(value) => {
          const updatedData = [...data];
          updatedData[cellInfo.index][cellInfo.column.id] = value;
          updateData(updatedData);
        }}
      />
    </div>
  );
  return renderEditable;
};

export const getEditableSelectCell = (data, updateData, options) => {
  const renderEditable = (cellInfo) => {
    if (!data[cellInfo.index]) {
      return null;
    }
    const currentValue = data[cellInfo.index][cellInfo.column.id] ? data[cellInfo.index][cellInfo.column.id] : '';
    return (
      <select
        value={currentValue}
        id={cellInfo.column.id}
        className="form-control"
        name={cellInfo.column.id}
        onChange={(e) => {
          const updatedData = [...data];
          updatedData[cellInfo.index][cellInfo.column.id] = e.target.value;
          updateData(updatedData);
        }}
      >
        {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
    );
  };
  return renderEditable;
};

export const getEditableCheckboxesCell = (data, updateData, options) => {
  const renderEditable = (cellInfo) => {
    if (!data[cellInfo.index]) {
      return null;
    }
    let fieldValue = data[cellInfo.index][cellInfo.column.id];
    return (
      <div className="text-left">
        {options.map(({ value: optionValue, label }) => (
          <CustomInput
            checked={fieldValue && fieldValue.includes(optionValue)}
            type="checkbox"
            id={`${optionValue}_${cellInfo.index}`}
            onChange={(e) => {
              fieldValue = fieldValue || [];
              const option = e.target.value;
              const isChecked = e.target.checked;
              if (isChecked) {
                if (!fieldValue.includes(option)) {
                  fieldValue.push(option);
                }
                fieldValue = [...fieldValue];
              } else {
                fieldValue = fieldValue.filter((el) => el !== option);
              }
              const updatedData = [...data];
              updatedData[cellInfo.index][cellInfo.column.id] = fieldValue;
              updateData(updatedData);
            }}
            value={optionValue}
            key={`${optionValue}_${cellInfo.index}`}
            label={label}
          />
        ))}
      </div>
    );
  };
  return renderEditable;
};
