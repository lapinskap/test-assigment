import React, { useState } from 'react';
import {
  Card, CardBody, CardTitle, Button,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import DatePicker from '../../../../../Components/FormElements/DatePicker';
import ToggleSwitch from '../../../../../Components/FormElements/ToggleSwitch';
import MultiSelectParameter from './multiSelectParameter';

export default function Parameters({
  parameters, parametersState, setParametersState, subscription, setInvalidParameters, isAhr, isCreator,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const angleDirection = isOpen ? 'up' : 'down';
  const disabledParam = !((isAhr && isCreator) || !isAhr);

  const generateParameters = () => {
    const paramArray = [];
    let tempArr = [];
    for (let index = 1; index <= parameters.length; index += 1) {
      tempArr.push(parameters[index - 1]);

      if (index % 4 === 0 || index === parameters.length) {
        paramArray.push(tempArr);
        tempArr = [];
      }
    }
    return paramArray.map((paramItem) => (
      <div key={paramItem[0].parameterName} className="row">
        {
        paramItem.map((item) => (
          <div key={item.parameterName} className="col-md-3 col-sm-12">
            {renderParameter(item)}
          </div>
        ))
        }

      </div>
    ));
  };

  const updateParameterState = (newValue, paramIndex) => {
    let newVal = newValue;
    if (newVal === '[]') { newVal = null; }

    const arr = [...parametersState];
    arr[paramIndex].values = [newVal];
    setParametersState(arr);
  };

  const updateParameterStateMultiSelect = (newValue, paramIndex) => {
    const multiArr = [];

    newValue.map((item) => multiArr.push({ label: item.label, value: item.value }));

    const arr = [...parametersState];
    arr[paramIndex].values = multiArr;
    setParametersState(arr);
  };

  const updateParameterStateSelect = (newValue, paramIndex) => {
    const arr = [...parametersState];
    arr[paramIndex].values = [{ label: newValue.label, value: newValue.value }];
    setParametersState(arr);
  };

  const renderParameter = (item) => {
    const paramIndex = parametersState.findIndex((x) => x.parameterName === item.parameterName);
    if (parametersState.length > 0) {
      switch (item.type) {
        case 'DateTime':
        {
          let dateValue = parametersState[paramIndex].values[0];
          let nvalidClass = '';

          if (typeof dateValue === 'undefined') { dateValue = new Date(); }

          // validation
          if (!dateValue && item.isRequired) {
            nvalidClass = ' ';
            setInvalidParameters(item.parameterName, true);
          } else {
            setInvalidParameters(item.parameterName, false);
          }

          return (
            <DatePicker
              errorMessage={nvalidClass}
              label={item.label}
              value={dateValue}
              onChange={(newValue) => updateParameterState(newValue, paramIndex)}
              validateField={() => { }}
              disabled={disabledParam}
            />
          );
        }
        case 'Select':
        {
          const value = parametersState[paramIndex].values ?? {};
          // const value = selectedValue(parametersState[paramIndex].values[0], item.selectOptions);
          let nvalidClass = '';

          // validation
          if (!value.value && item.isRequired) {
            nvalidClass = 'non-valid-parameter';
            setInvalidParameters(item.parameterName, true);
          } else {
            setInvalidParameters(item.parameterName, false);
          }

          return (
            <>
              <label htmlFor={item.parameterName}>{item.label}</label>
              <Select
                defaultValue={{ label: item.label, value: parametersState[paramIndex].values[0] }}
                name="select-params"
                className={`basic-select ${nvalidClass}`}
                classNamePrefix="select"
                options={item.selectOptions}
                onChange={(e) => { updateParameterStateSelect(e, paramIndex); }}
                value={value}
                isDisabled={disabledParam}
              />
            </>
          );
        }
        case 'Multiselect':
        {
          // const defaultValue = multiSelectedValue(parametersState[paramIndex].values, item.selectOptions);

          const defaultValue = parametersState[paramIndex].values ?? [];
          let nvalidClass = '';

          // validation
          if (defaultValue.length === 0 && item.isRequired) {
            nvalidClass = 'non-valid-parameter';
            setInvalidParameters(item.parameterName, true);
          } else {
            setInvalidParameters(item.parameterName, false);
          }

          return (
            <>
              <label htmlFor={item.parameterName}>{item.label}</label>
              <MultiSelectParameter
                isMulti
                name="multiselect-params"
                className={`basic-multi-select ${nvalidClass}`}
                classNamePrefix="select"
                options={item.selectOptions}
                allowSelectAll
                hideSelectedOptions={false}
                onChange={(i) => updateParameterStateMultiSelect(i, paramIndex)}
                value={defaultValue}
                isRequired={item.isRequired}
                disabledParam={disabledParam}
              />
            </>
          );
        }
        case 'Boolean':
        {
          let boolValue = parametersState[paramIndex].values[0];

          if (typeof boolValue === 'undefined') { boolValue = false; }

          if (typeof boolValue !== 'boolean') { if (typeof boolValue !== 'undefined') boolValue = (boolValue === 'true'); }

          return (
            <>
              <label htmlFor={item.parameterName}>{item.label}</label>
              <div className="d-block w-100 text-center">

                <ToggleSwitch
                  id={item.parameterName}
                  handleChange={(isOn) => updateParameterState(isOn, paramIndex)}
                  checked={boolValue}
                  disabled={disabledParam}
                />
              </div>
            </>
          );
        }
        case 'String':
        default:
        {
          const val = parametersState[paramIndex].values[0] ?? '';
          let nvalidClass = '';

          // validation
          if (val === '' && item.isRequired) {
            nvalidClass = 'non-valid-parameter';
            setInvalidParameters(item.parameterName, true);
          } else {
            setInvalidParameters(item.parameterName, false);
          }

          return (
            <>
              <label htmlFor={item.parameterName}>{item.label}</label>
              <input
                id={item.parameterName}
                type="text"
                className={`form-control ${nvalidClass}`}
                value={val}
                onChange={(e) => updateParameterState(e.target.value, paramIndex)}
                disabled={disabledParam}
              />
            </>
          );
        }
      }
    }
    return '';
  };

  const renderParemeters = () => (
    <div>
      <form>
        {generateParameters()}
      </form>
    </div>
  );

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggle}>
            <div className="row">
              <div className="col-md-10" style={{ marginTop: '15px' }}>
                Parametry
              </div>
              <div className="col-md-2 text-right">
                <Button color="link">
                  <i className={`pe-7s-angle-${angleDirection} pe-3x`} />
                </Button>
              </div>
            </div>
          </CardTitle>
          {isOpen && renderParemeters()}
          <hr />
          <CardTitle style={{ userSelect: 'none' }} onClick={toggle}>
            Wysyłka raportu
          </CardTitle>
          {subscription}
        </CardBody>
      </Card>
    </>
  );
}

Parameters.propTypes = {
  parameters: PropTypes.arrayOf.isRequired,
  parametersState: PropTypes.arrayOf.isRequired,
  setParametersState: PropTypes.func.isRequired,
  subscription: PropTypes.node.isRequired,
  setInvalidParameters: PropTypes.func.isRequired,
  isAhr: PropTypes.bool.isRequired,
  isCreator: PropTypes.bool.isRequired,
};
