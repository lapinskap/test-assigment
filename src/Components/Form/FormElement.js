/* eslint react/jsx-props-no-spreading: off */
/* eslint no-case-declarations: off */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  CustomInput,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardTitle,
} from 'reactstrap';

import { isNumber } from 'recharts/lib/util/DataUtils';
import ToggleSwitch from '../FormElements/ToggleSwitch';
import DatePicker from '../FormElements/DatePicker';
import DateRange from '../FormElements/DateRange';
import NumberRange from '../FormElements/NumberRange';
import Tooltip from '../Tooltips/defaultTooltip';
import DateTimePicker from '../FormElements/DateTimePicker';
import __ from '../../utils/Translations';
import ValueFormatter from '../../utils/ValueFormatter';
import ValidationMessage from './ValidationMessage';
import IPv4 from '../FormElements/IPv4';
import Multiselect from '../FormElements/Multiselect';
// eslint-disable-next-line import/no-cycle
import DynamicTranslationTrigger from '../DynamicTranslation/DynamicTranslationTrigger';
import Wysiwyg from '../FormElements/Wysiwyg';
import { Autocomplete, AsyncAutocomplete } from '../FormElements/Autocomplete/index';
import InputSwitcher from '../FormElements/InputSwitcher';
import Checkboxes from '../FormElements/Checkboxes';
import hashInputId from '../../utils/jsHelpers/hashInputId';
import PasswordInput from '../FormElements/PasswordInput';
import Legend from '../FormElements/Legend';
import { defaultValidation } from './utils';
import MonthPicker from '../FormElements/MonthPicker';

export default function FormElement(
  {
    id,
    type,
    validation,
    placeholder: placeholderProps,
    props: restProps = {},
    label: labelPops,
    onChange,
    value,
    options = [],
    tooltip,
    tooltipPosition,
    suffix,
    prefix,
    valueFormatter,
    validateField,
    errorMessage,
    translatable,
    fetchOptions,
    isCheckbox,
    inputSwitcher,
    className,
    showTimeSelect,
    legend,
  },
) {
  const [inputSwitcherChecked, setInputSwitcherChecked] = useState(Boolean(inputSwitcher && inputSwitcher.checkedByDefault));
  let updateFunction;
  let tooltipComponent;
  if (tooltip) {
    tooltipComponent = <Tooltip id={`form_tooltip_${id}`} type={tooltip.type} content={tooltip.content} placement={tooltip.placement} />;
  }
  const placeholder = placeholderProps ? __(placeholderProps) : null;
  let label = null;
  if (labelPops) {
    const isRequired = validation && validation.find((el) => el === 'required');
    label = __(labelPops);
    if (isRequired) {
      label = (
        <>
          {label}
          {' '}
          <span className="text-danger">*</span>
        </>
      );
    }
  }
  const isInValid = Boolean(errorMessage);
  const {
    format, inline, columns, height, withLines, disabled, previewToggle, buttons,
  } = restProps;

  let translatorTrigger;
  if (translatable) {
    translatorTrigger = (
      <DynamicTranslationTrigger
        scope={translatable.scope}
        code={translatable.code}
        isCms={translatable.isCms}
        value={value}
        isTitle={translatable.isTitle || false}
      />
    );
  }
  let inputDisabled = disabled;

  let inputSwitcherComponent = null;
  if (inputSwitcher && !inputSwitcher.perOption) {
    const onChangeInputSwitcher = (isChecked) => {
      setInputSwitcherChecked(isChecked);
      if (inputSwitcher.onChange) {
        inputSwitcher.onChange(id, isChecked);
        if (isChecked) {
          validateField(id, value, []);
        }
      }
    };
    const checked = inputSwitcher.switcherValue || inputSwitcherChecked;
    inputSwitcherComponent = (
      <InputSwitcher
        onChange={onChangeInputSwitcher}
        id={id}
        checked={checked}
        label={inputSwitcher.label}
      />
    );
    inputDisabled = disabled
      || (inputSwitcher.disableIfChecked && checked)
      || (inputSwitcher.disableIfNotChecked && !checked);
  }
  let inputGroup;
  switch (type) {
    case 'text':
    case 'textarea':
    case 'time':
    case 'number':
      const inputValidation = validation ? [...validation, defaultValidation] : [defaultValidation];
      updateFunction = (e) => {
        let { value: newValue } = e.target;
        if (type === 'number') {
          if (newValue === '') {
            newValue = null;
          } else {
            newValue = +newValue;
            if (isNumber(restProps.min) && (newValue < restProps.min)) {
              newValue = restProps.min;
            } else if (isNumber(restProps.max) && (newValue > restProps.max)) {
              newValue = restProps.max;
            }
          }
        }
        if (valueFormatter) {
          newValue = ValueFormatter(valueFormatter, newValue);
        }
        if (isInValid && validation) {
          validateField(id, newValue, inputValidation);
        }

        onChange(id, newValue);
      };
      const input = (
        <Input
          invalid={isInValid}
          type={type}
          name={hashInputId(id)}
          onBlur={(e) => {
            validateField(id, e.target.value, inputValidation);
          }}
          data-t1={id}
          id={hashInputId(id)}
          placeholder={placeholder}
          value={value || value === 0 ? value : ''}
          onChange={updateFunction}
          {...restProps}
          disabled={inputDisabled}
          className={className}
          autoComplete="chrome-off"
        />
      );

      inputGroup = (
        <InputGroup>
          {prefix ? (
            <InputGroupAddon addonType="prepend">
              <InputGroupText>{prefix}</InputGroupText>
            </InputGroupAddon>
          ) : null}
          {input}
          {suffix ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>{suffix}</InputGroupText>
            </InputGroupAddon>
          ) : null}
          {tooltipComponent && tooltipPosition === 'input' ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>{tooltipComponent}</InputGroupText>
            </InputGroupAddon>
          ) : null}
          <ValidationMessage message={errorMessage} />
        </InputGroup>
      );

      return (
        <FormGroup>
          {label || (tooltipComponent && tooltipPosition === 'label') || translatorTrigger ? (
            <Label data-t1={`${id}Label`} for={id}>
              {label}
                    &nbsp;
              {translatorTrigger || ''}
              {tooltipComponent && tooltipPosition === 'label' ? (
                <>
                  {' '}
                  {tooltipComponent}
                </>
              ) : null}
            </Label>
          ) : null}
          {inputSwitcherComponent ? (
            <Row>
              <Col sm={9}>
                {inputGroup}
              </Col>
              <Col sm={3}>
                {inputSwitcherComponent}
              </Col>
            </Row>
          ) : inputGroup}
        </FormGroup>
      );
    case 'password':
      return (
        <PasswordInput
          id={id}
          className={className}
          label={label}
          value={value}
          errorMessage={errorMessage}
          validation={validation}
          validateField={validateField}
          disabled={inputDisabled}
          onChange={onChange}
          tooltip={tooltipComponent}
          previewToggle={previewToggle}
        />
      );
    case 'boolean':
      updateFunction = (isOn) => {
        onChange(id, isOn);
      };
      return !isCheckbox ? (
        <FormGroup>
          <ToggleSwitch
            id={id}
            label={label}
            checked={Boolean(value)}
            handleChange={updateFunction}
            disabled={inputDisabled}
            tooltip={tooltipComponent}
            afterLabel={inputSwitcherComponent}
          />
        </FormGroup>
      ) : (
        <FormGroup>
          <Row>
            <CustomInput
              data-t1={id}
              inline={inline}
              checked={Boolean(value)}
              type="checkbox"
              id={hashInputId(id)}
              disabled={inputDisabled}
              onChange={(e) => updateFunction(e.target.checked)}
              value={id}
              name={id}
              className="ml-3"
              label={label}
            />
            {tooltipComponent ? <div className="ml-1">{tooltipComponent}</div> : null}
          </Row>
        </FormGroup>

      );
    case 'select':
      updateFunction = (e) => {
        let { value: newValue } = e.target;
        if (newValue === '') {
          newValue = null;
        }
        if (valueFormatter) {
          newValue = ValueFormatter(valueFormatter, newValue);
        }
        validateField(id, e.target.value, validation);
        onChange(id, newValue);
      };
      const newOptions = [...options];
      newOptions.unshift({
        value: '',
        label: '---Nie wybrano ---',
      });
      inputGroup = (
        <InputGroup>
          <Input
            data-t1={id}
            type="select"
            name={id}
            id={id}
            disabled={inputDisabled}
            className={`${className}${errorMessage ? ' is-invalid-select' : ''}`}
            value={value !== null ? value : undefined}
            onChange={updateFunction}
          >
            {newOptions.map(({ value: optionValue, label: optionLabel }) => (
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel || optionValue}
              </option>
            ))}
          </Input>
          <ValidationMessage message={errorMessage} />
          {suffix ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>{suffix}</InputGroupText>
            </InputGroupAddon>
          ) : null}
          {tooltipComponent && tooltipPosition === 'input' ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>{tooltipComponent}</InputGroupText>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      );
      return (
        <FormGroup>
          <Label data-t1={`${id}Label`} for={id}>
            {label}
            {tooltipComponent && tooltipPosition === 'label' ? (
              <>
                {' '}
                {tooltipComponent}
              </>
            ) : null}
          </Label>
          {inputSwitcherComponent ? (
            <Row>
              <Col sm={9}>
                {inputGroup}
              </Col>
              <Col sm={3}>
                {inputSwitcherComponent}
              </Col>
            </Row>
          ) : inputGroup}
        </FormGroup>
      );
    case 'radio':
      updateFunction = (e) => {
        validateField(id, e.target.value, validation);
        onChange(id, e.target.value);
      };
      return (
        <FormGroup className="input-group-omb">
          {label ? (
            <Label data-t1={`${id}Label`} for={id}>
              {label}
              &nbsp;
              {tooltipComponent}
              {inputSwitcherComponent ? <span data-t1={`${id}LabelSwitcher`} className="ml-3">{inputSwitcherComponent}</span> : null}
            </Label>
          ) : null}
          <div data-t1={id}>
            {options.map(({
              value: optionValue, label: optionLabel, tooltip: optionTooltip, disabled: optionDisabled,
            }) => {
              let optionLabelComponent = optionLabel;
              if (optionTooltip) {
                const optionTooltipComponent = (
                  <Tooltip
                    id={`form_tooltip_${optionValue}`}
                    type={optionTooltip.type}
                    content={optionTooltip.content}
                    placement={optionTooltip.placement}
                  />
                );
                optionLabelComponent = (
                  <span data-t1={`${id}OptionLabel`}>
                    {optionLabel}
                    {' '}
                    {optionTooltipComponent}
                  </span>
                );
              }
              return (
                <CustomInput
                  invalid={isInValid}
                  key={optionValue}
                  type="radio"
                  id={hashInputId(optionValue)}
                  onChange={updateFunction}
                  value={optionValue}
                  checked={Boolean(value && value === String(optionValue))}
                  name={id}
                  disabled={optionDisabled || inputDisabled}
                  label={optionLabelComponent}
                  data-t1={optionValue}
                />
              );
            })}
          </div>
          <ValidationMessage message={errorMessage} />
        </FormGroup>
      );
    case 'checkbox':
      return (
        <FormGroup>
          <Checkboxes
            options={options}
            disabled={inputDisabled}
            afterLabel={inputSwitcherComponent}
            label={label}
            tooltip={tooltipComponent}
            columns={columns}
            id={id}
            buttons={buttons}
            validation={validation}
            value={value}
            errorMessage={errorMessage}
            onChange={onChange}
            valueFormatter={valueFormatter}
            validateField={validateField}
            inline={inline}
            optionSwitcher={(inputSwitcher && inputSwitcher.perOption) ? inputSwitcher : null}
          />
        </FormGroup>
      );
    case 'date':
      updateFunction = (date) => {
        onChange(id, date);
      };
      return (
        <FormGroup>
          <DatePicker
            label={label}
            tooltip={tooltipComponent}
            tooltipPosition={tooltipPosition}
            value={value}
            inputSwitcher={inputSwitcherComponent}
            disabled={inputDisabled}
            onChange={updateFunction}
            id={id}
            errorMessage={errorMessage}
            validation={validation}
            validateField={validateField}
            format={format}
            showTimeSelect={showTimeSelect}
          />
        </FormGroup>
      );
    case 'month':
      updateFunction = (date) => {
        onChange(id, date);
      };
      return (
        <FormGroup>
          <MonthPicker
            label={label}
            tooltip={tooltipComponent}
            tooltipPosition={tooltipPosition}
            value={value}
            inputSwitcher={inputSwitcherComponent}
            disabled={inputDisabled}
            onChange={updateFunction}
            id={id}
            errorMessage={errorMessage}
            validation={validation}
            validateField={validateField}
            format={format}
            showTimeSelect={showTimeSelect}
          />
        </FormGroup>
      );
    case 'dateRange':
      updateFunction = (date) => {
        onChange(id, date);
      };
      return (
        <FormGroup>
          <DateRange
            label={label}
            value={value}
            disabled={inputDisabled}
            afterLabel={inputSwitcherComponent}
            onChange={updateFunction}
            id={id}
            format={format}
            validation={validation}
            errorMessage={errorMessage}
            validateField={validateField}
          />
        </FormGroup>
      );
    case 'numberRange':
      updateFunction = (date) => {
        onChange(id, date);
      };
      return (
        <FormGroup>
          <NumberRange
            label={label}
            value={value}
            onChange={updateFunction}
            disabled={inputDisabled}
            afterLabel={inputSwitcherComponent}
            id={id}
            {...restProps}
            errorMessage={errorMessage}
            validateField={validateField}
            validation={validation}
          />
        </FormGroup>
      );
    case 'file':
      updateFunction = (e) => {
        validateField(id, e.target.files, validation);
        onChange(id, e.target.files);
      };
      inputGroup = (
        <InputGroup className={errorMessage ? 'error-message-color' : undefined}>
          <Input
            data-t1={id}
            type="file"
            id={hashInputId(id)}
            name={hashInputId(id)}
            invalid={isInValid}
            disabled={inputDisabled}
            onChange={updateFunction}
            label="Wybierz plik"
          />
          {tooltipComponent && tooltipPosition === 'input' ? (
            <InputGroupAddon addonType="append">
              <InputGroupText>{tooltipComponent}</InputGroupText>
            </InputGroupAddon>
          ) : null}
          <ValidationMessage message={errorMessage} />
        </InputGroup>
      );
      return (
        <FormGroup>
          <Label data-t1={`${id}Label`} for={id}>
            {label}
            {tooltipComponent && tooltipPosition === 'label' ? (
              <>
                {' '}
                {tooltipComponent}
              </>
            ) : null}
          </Label>
          {inputSwitcherComponent ? (
            <Row>
              <Col sm={9}>
                {inputGroup}
              </Col>
              <Col sm={3}>
                {inputSwitcherComponent}
              </Col>
            </Row>
          ) : inputGroup}
        </FormGroup>
      );
    case 'staticValue':
      return (
        <FormGroup>
          <Label data-t1={`${id}Label`} for={id}>
            {label}
            &nbsp;
            {tooltipComponent}
          </Label>
          <div>{value !== undefined ? value : 'b/d'}</div>
        </FormGroup>
      );
    case 'wysiwyg':

      return (
        <FormGroup>
          <Wysiwyg
            id={id}
            label={label}
            translatorTrigger={translatorTrigger}
            value={value}
            height={height}
            errorMessage={errorMessage}
            validation={validation}
            validateField={validateField}
            disabled={inputDisabled}
            onChange={onChange}
            belowLabelComponent={inputSwitcherComponent}
            tooltip={tooltipComponent}
          />
        </FormGroup>
      );
    case 'autocomplete':
    case 'autocompleteMultiselect':
      const isMultiselect = type === 'autocompleteMultiselect';
      if (isMultiselect) {
        updateFunction = (selectedOptions) => {
          onChange(id, selectedOptions ? selectedOptions.map((el) => el.value) : []);
        };
      } else {
        updateFunction = (option) => {
          onChange(id, option ? option.value : null);
        };
      }
      return (
        <FormGroup>
          <Autocomplete
            id={id}
            label={label}
            isMultiselect={isMultiselect}
            errorMessage={errorMessage}
            validation={validation}
            validateField={validateField}
            inputSwitcher={inputSwitcherComponent}
            disabled={inputDisabled}
            onChange={updateFunction}
            options={options}
            tooltip={tooltipComponent}
            value={value}
          />
        </FormGroup>
      );
    case 'asyncAutocomplete':
    case 'asyncAutocompleteMultiselect':
      const isAsyncMultiselect = type === 'asyncAutocompleteMultiselect';
      if (isAsyncMultiselect) {
        updateFunction = (selectedOptions) => {
          onChange(id, selectedOptions ? selectedOptions.map((el) => el.value) : []);
        };
      } else {
        updateFunction = (option) => {
          onChange(id, option ? option.value : null);
        };
      }
      return (
        <FormGroup>
          <AsyncAutocomplete
            id={id}
            label={label}
            isMultiselect={isAsyncMultiselect}
            errorMessage={errorMessage}
            fetchOptions={fetchOptions}
            inputSwitcher={inputSwitcherComponent}
            disabled={inputDisabled}
            validation={validation}
            validateField={validateField}
            onChange={updateFunction}
            tooltip={tooltipComponent}
            value={value}
          />
        </FormGroup>
      );
    case 'datetime':
      updateFunction = ({ date, time }) => {
        onChange(id, {
          date,
          time,
        });
      };
      return (
        <FormGroup>
          <DateTimePicker
            id={id}
            label={label}
            tooltip={tooltipComponent}
            value={value}
            disabled={inputDisabled}
            afterLabel={inputSwitcherComponent}
            onChange={updateFunction}
            errorMessage={errorMessage}
            validateField={validateField}
            validation={validation}
          />
        </FormGroup>
      );
    case 'datetimeRange':
      // TODO
      return null;
    case 'title':
      const title = <CardTitle>{label}</CardTitle>;
      return withLines ? (
        <>
          <hr />
          {title}
          <hr />
        </>
      ) : title;
    case 'hr':
      return <hr />;
    case 'button':
      return (
        <>
          <Button data-t1={id} onClick={onChange}>{label}</Button>
          {tooltipComponent}
        </>
      );
    case 'ipv4':
      updateFunction = (e) => {
        let { value: newValue } = e.target;
        // eslint-disable-next-line no-shadow
        newValue = ValueFormatter('ipv4', newValue);
        onChange(id, newValue);
      };
      return (
        <FormGroup>
          <IPv4
            id={id}
            label={label}
            tooltip={tooltipComponent}
            tooltipPosition={tooltipPosition}
            value={value}
            onChange={updateFunction}
            inputSwitcher={inputSwitcherComponent}
            disabled={inputDisabled}
            errorMessage={errorMessage}
            validateField={validateField}
            validation={validation}
            placeholder="000.000.000.000"
          />
        </FormGroup>
      );
    case 'multiselect':
      updateFunction = (e) => {
        const { options: multiselectOptions } = e.target;
        const newValue = [];
        multiselectOptions.forEach((option) => {
          if (option.selected) {
            newValue.push(option.value);
          }
        });
        onChange(id, newValue);
      };
      return (
        <Multiselect
          id={id}
          label={label}
          tooltip={tooltipComponent}
          value={value}
          onChange={updateFunction}
          afterLabel={inputSwitcherComponent}
          errorMessage={errorMessage}
          validateField={validateField}
          validation={validation}
          options={options}
          invalid={isInValid}
          disabled={inputDisabled}
        />
      );
    case 'legend':
      return (
        <Legend
          id={id}
          title={label}
          tooltip={tooltipComponent}
          value={value}
          legend={legend}
        />
      );
    default:
      return null;
  }
}

FormElement.propTypes = {
  dataOldSk: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    isDisabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      isDisabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })),
    className: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    tooltip: PropTypes.shape({
      content: PropTypes.node,
      type: PropTypes.string,
    }),
  })),
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  showTimeSelect: PropTypes.bool,
  props: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    from: PropTypes.number,
    to: PropTypes.number,
    columns: PropTypes.number,
    buttons: PropTypes.number,
    withLines: PropTypes.bool,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    previewToggle: PropTypes.bool,
    rows: PropTypes.number,
  }),
  suffix: PropTypes.string,
  tooltip: PropTypes.shape({
    content: PropTypes.node,
    type: PropTypes.string,
    placement: PropTypes.string,
  }),
  tooltipPosition: PropTypes.oneOf(['label', 'input']),
  translatable: PropTypes.shape({
    isCms: PropTypes.bool,
    code: PropTypes.string,
    isTitle: PropTypes.bool,
    scope: PropTypes.string,
  }),
  displayCondition: PropTypes.bool, // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
  valueFormatter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]), // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  errorMessage: PropTypes.string,
  validateField: PropTypes.func,
  fetchOptions: PropTypes.func,
  isCheckbox: PropTypes.bool,
  inputSwitcher: PropTypes.shape({
    onChange: PropTypes.func,
    label: PropTypes.string,
    checkedByDefault: PropTypes.bool,
    switcherValue: PropTypes.bool,
    disableIfChecked: PropTypes.bool,
    disableIfNotChecked: PropTypes.bool,
    perOption: PropTypes.bool,
  }),
};

FormElement.defaultProps = {
  dataOldSk: '',
  label: '',
  id: null,
  type: 'text',
  options: [],
  placeholder: '',
  prefix: '',
  legend: [],
  props: {},
  suffix: '',
  tooltip: null,
  tooltipPosition: 'label',
  displayCondition: false,
  validation: [],
  valueFormatter: null,
  value: null,
  errorMessage: null,
  validateField: null,
  translatable: null,
  isCheckbox: null,
  fetchOptions: null,
  inputSwitcher: null,
  className: '',
  showTimeSelect: false,
};
