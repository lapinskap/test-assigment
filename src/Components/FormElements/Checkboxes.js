import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import {
  Label, Col, CustomInput, Row, Button,

} from 'reactstrap';
import ValidationMessage from '../Form/ValidationMessage';
import ValueFormatter from '../../utils/ValueFormatter';
import Tooltip from '../Tooltips/defaultTooltip';
import InputSwitcher from './InputSwitcher';
import __ from '../../utils/Translations';

export const CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL = 1;
export const CHECKBOXES_BUTTONS_SELECT_ALL = 2;
export const CHECKBOXES_BUTTONS_DESELECT_ALL = 3;

export default function Checkboxes({
  id, label, validation, value, validateField, tooltip, errorMessage, onChange, options, disabled, afterLabel, inline,
  valueFormatter, columns, optionSwitcher, buttons,
}) {
  const [optionsSwitcherChecked, setOptionsSwitcherChecked] = useState(
    (optionSwitcher && optionSwitcher.checkedByDefault) ? options.map(({ value: optionValue }) => optionValue) : [],
  );

  const updateFunction = (e) => {
    let values = value || [];
    let option = e.target.value;
    if (valueFormatter) {
      option = ValueFormatter(valueFormatter, option);
    }
    const isChecked = e.target.checked;
    if (isChecked) {
      if (!values.includes(option)) {
        values.push(option);
      }
      values = [...values];
    } else {
      values = values.filter((el) => el !== option);
    }
    validateField(id, values, validation);
    onChange(id, values);
  };

  const selectAll = () => {
    const values = options.map(({ value: optionValue }) => optionValue);
    validateField(id, values, validation);
    onChange(id, values, values);
  };
  const deselectAll = () => {
    const values = [];
    validateField(id, values, validation);
    onChange(id, values, values);
  };

  const getOption = ({
    // eslint-disable-next-line react/prop-types
    value: optionValue, label: optionLabel, tooltip: optionTooltip, className = '', disabled: checkboxDisabled = false,
  }) => {
    let optionTooltipComponent;
    if (optionTooltip) {
      optionTooltipComponent = (
        <Tooltip
          id={`form_tooltip_${optionValue}`}
          type={optionTooltip.type}
          content={optionTooltip.content}
          placement={optionTooltip.placement}
        />
      );
    }
    let optionLabelComponent = optionLabel;
    optionLabelComponent = optionTooltipComponent ? (
      <Fragment data-t1={`${id}Label`}>
        {optionLabel}
        {' '}
        {optionTooltipComponent}
      </Fragment>
    ) : optionLabelComponent;

    const optionId = `${id}_${optionValue}`;

    const optionSwitcherChecked = optionsSwitcherChecked.includes(optionValue);
    let optionDisabled = disabled || checkboxDisabled;
    let optionSwitcherComponent = null;
    if (optionSwitcher) {
      const onChangeOptionSwitcher = (isChecked) => {
        if (isChecked) {
          if (!optionsSwitcherChecked.includes(optionValue)) {
            const updatedData = [...optionsSwitcherChecked];
            updatedData.push(optionValue);
            setOptionsSwitcherChecked(updatedData);
          }
        } else {
          setOptionsSwitcherChecked(optionsSwitcherChecked.filter((elId) => elId !== optionValue));
        }
        if (optionSwitcher.onChange) {
          optionSwitcher.onChange(optionValue, isChecked);
        }
      };
      optionSwitcherComponent = (
        <InputSwitcher
          onChange={onChangeOptionSwitcher}
          id={optionValue}
          checked={optionSwitcherChecked}
          label={optionSwitcher.label}
        />
      );
      optionDisabled = optionDisabled
        || (optionSwitcher.disableIfChecked && optionSwitcherChecked)
        || (optionSwitcher.disableIfNotChecked && !optionSwitcherChecked);
    }

    const inputGroup = (
      <Fragment key={optionValue}>
        <CustomInput
          inline={inline}
          checked={(value && value.includes(optionValue)) || false}
          type="checkbox"
          id={optionId}
          onChange={updateFunction}
          value={optionValue}
          disabled={optionDisabled}
          name={optionId}
          label={optionLabelComponent}
          invalid={Boolean(errorMessage)}
          className={`${className}${errorMessage ? ' is-invalid' : ''}`}
          data-t1={id || optionValue}
        />
      </Fragment>
    );

    return (optionSwitcherComponent ? (
      <Row key={optionId} data-t1={optionId}>
        <Col sm={2}>
          {inputGroup}
        </Col>
        <Col sm="auto">
          {optionSwitcherComponent}
        </Col>
      </Row>
    ) : inputGroup);
  };

  const buttonsComponents = [];
  if (buttons) {
    if ([CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL, CHECKBOXES_BUTTONS_SELECT_ALL].includes(buttons)) {
      buttonsComponents.push((
        <Button data-t1="selectAll" outline size="sm" className="mr-1 mb-1" onClick={selectAll}>{__('Zaznacz wszystko')}</Button>
      ));
    }
    if ([CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL, CHECKBOXES_BUTTONS_DESELECT_ALL].includes(buttons)) {
      buttonsComponents.push((
        <Button data-t1="deselectAll" outline size="sm" className="mr-1 mb-1" onClick={deselectAll}>{__('Odznacz wszystko')}</Button>
      ));
    }
  }

  return (
    <>
      { label || tooltip ? (
        <Label data-t1={`${id}Label`} for={id}>
          {label}
          {validation && validation.includes('requiredCheckbox') ? (
            <>
              {' '}
              <span className="text-danger">*</span>
            </>
          ) : null}
        &nbsp;
          {tooltip}
          {afterLabel ? <span data-t1="afterLabel" className="ml-3">{afterLabel}</span> : null}
        </Label>
      ) : null }
      <div data-t1={id}>
        { buttonsComponents }
        {columns > 1 && options.length > 10 ? (
          <Row>
            {[...Array(columns)
              .keys()].map((i) => (
                <Col key={i}>
                  {options
                    .slice(
                      i * Math.ceil(options.length / columns),
                      (i + 1) * Math.ceil(options.length / columns),
                    )
                    .map(getOption)}
                </Col>
            ))}
          </Row>
        ) : (
          options.map(getOption)
        )}
      </div>
      <ValidationMessage message={errorMessage} />
    </>
  );
}

Checkboxes.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  disabled: PropTypes.bool,
  afterLabel: PropTypes.node,
  errorMessage: PropTypes.string,
  inline: PropTypes.bool,
  valueFormatter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  columns: PropTypes.number,
  validateField: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
  })).isRequired,
  optionSwitcher: PropTypes.shape({
    onChange: PropTypes.func,
    label: PropTypes.string,
    checkedByDefault: PropTypes.bool,
    disableIfChecked: PropTypes.bool,
    disableIfNotChecked: PropTypes.bool,
    perOption: PropTypes.bool,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
  buttons: PropTypes.oneOf([
    CHECKBOXES_BUTTONS_DESELECT_ALL, CHECKBOXES_BUTTONS_SELECT_ALL, CHECKBOXES_BUTTONS_SELECT_DESELECT_ALL,
  ]),
};

Checkboxes.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  afterLabel: null,
  value: [],
  errorMessage: null,
  validateField: () => {},
  validation: null,
  inline: false,
  valueFormatter: null,
  optionSwitcher: null,
  columns: null,
  buttons: null,
  disabled: false,
};
