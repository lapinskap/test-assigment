import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import {
  Col, ModalBody, ModalFooter, ModalHeader, Row, Card, CardBody, Form,
} from 'reactstrap';
import FormTitle from './FormTitle';
// eslint-disable-next-line import/no-cycle
import FormGroup, { shouldDisplayElement } from './FormGroup';
import validate from '../../utils/Validation';
import ButtonsList from '../ButtonsList';
import __ from '../../utils/Translations';
import scrollTo from '../../utils/jsHelpers/scrollTo';
import { getActualValidation } from './utils';

export default function FormComponent({ config, data, id }) {
  const [invalidFields, setInvalidFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isInPopup = false,
    togglePopup = () => null,
    onSubmit = () => null,
    additionalValidation = null,
    formGroups,
    columns,
    buttons = [],
    stickyTitle = true,
    title = '',
    translateTitle = true,
    defaultOnChange,
    noCards = false,
    groupsAsColumns = false,
  } = config;

  const validateField = useCallback((fieldId, value, validation) => {
    if (!validation) {
      return;
    }
    const message = validate(value, validation);
    if (message === invalidFields[fieldId] || (!message && !invalidFields[fieldId])) {
      return;
    }
    const updatedObject = { ...invalidFields };
    if (message) {
      updatedObject[fieldId] = message;
    } else {
      delete updatedObject[fieldId];
    }
    setInvalidFields(updatedObject);
  }, [setInvalidFields, invalidFields]);

  const validateForm = () => {
    const validationResult = {};
    const formElementsToValidate = getAllFormElements(columns || formGroups);
    formElementsToValidate.forEach(({
      id: fieldId, validation, depends, displayCondition, type,
    }) => {
      const actualValidation = getActualValidation(validation, type);
      if (actualValidation && shouldDisplayElement(depends, data, displayCondition)) {
        const valueToCheck = type && type.toLowerCase().includes('range') ? {
          from: data[`${fieldId}From`],
          to: data[`${fieldId}To`],
        } : data[fieldId];
        const message = validate(valueToCheck, actualValidation);
        if (message) {
          validationResult[fieldId] = message;
        }
      }
    });
    setInvalidFields(validationResult);
    let isValid = Object.keys(validationResult).length === 0;
    if (additionalValidation) {
      isValid = additionalValidation(invalidFields, setInvalidFields) && isValid;
    }

    return isValid;
  };

  const groupRenderer = (key, formGroupConfig) => {
    const group = formGroupConfig ? (
      <FormGroup
        /* eslint-disable-next-line react/no-array-index-key */
        key={key}
        id={key}
        groupsAsColumns={groupsAsColumns}
        defaultOnChange={defaultOnChange}
        data={data}
        noCards={noCards || isInPopup}
        validateField={validateField}
        invalidFields={invalidFields}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...formGroupConfig}
      />
    ) : null;

    // eslint-disable-next-line react/no-array-index-key
    return groupsAsColumns ? <Col key={key}>{group}</Col> : group;
  };

  const formContent = getFormMainContent(formGroups, columns, groupRenderer);

  const buttonsElements = buttons.filter(Boolean)
    .map(({ type, ...buttonConfig }) => {
      if (type === 'submit') {
        if (isSubmitting) {
          return { type, ...buttonConfig, disabled: true };
        }
        if (Object.keys(invalidFields).length) {
          return { type, ...buttonConfig, tooltip: __('aby zapisać - popraw błędy') };
        }
      }
      return type ? { type, ...buttonConfig } : { ...buttonConfig };
    });

  const buttonsList = <ButtonsList buttons={buttonsElements} />;

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) {
      setIsSubmitting(true);
      const isValid = validateForm();
      if (isValid) {
        await onSubmit();
      } else {
        scrollToInvalid();
      }
      setIsSubmitting(false);
    }
  };

  return !isInPopup ? (
    <Form onSubmit={submit} data-t1={id}>
      {title ? (
        <FormTitle
          title={title}
          buttons={buttonsList}
          stickyTitle={stickyTitle}
          translateTitle={translateTitle}
        />
      ) : null}
      {groupsAsColumns ? getFormColumnsWrapper(formContent, noCards) : formContent}
      <button type="submit" className="d-none">submit</button>
    </Form>
  ) : (
    <Form onSubmit={submit} data-t1={id}>
      <ModalHeader toggle={() => togglePopup()}>{translateTitle ? __(title) : title}</ModalHeader>
      <ModalBody>
        {groupsAsColumns ? <Row>{formContent}</Row> : formContent}
      </ModalBody>
      <ModalFooter>
        {buttonsList}
      </ModalFooter>
      <button type="submit" className="d-none">submit</button>
    </Form>
  );
}

const getFormMainContent = (formGroups, columns, groupRenderer) => {
  if (columns && columns.length) {
    const size = Math.floor(12 / columns.length);
    return (
      <Row className="mt-3">
        {columns.map((column, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col sm={size} key={i}>
            {column.formGroups.map((formGroupConfig, key) => groupRenderer(key, formGroupConfig))}
          </Col>
        ))}
      </Row>
    );
  }
  return formGroups.map((formGroupConfig, key) => groupRenderer(key, formGroupConfig));
};

const getAllFormElements = (container) => {
  let result = [];
  container.forEach((el) => {
    if (el.formGroups || el.formElements) {
      result = result.concat(getAllFormElements(el.formGroups || el.formElements));
    } else {
      result.push(el);
    }
  });
  return result;
};

const getFormColumnsWrapper = (fromContent, noCards) => {
  const result = <Row>{fromContent}</Row>;
  return noCards ? result : <Card><CardBody>{result}</CardBody></Card>;
};

export const scrollToInvalid = () => {
  setTimeout(() => {
    const invalidElement = document.querySelector('.invalid-feedback');
    if (invalidElement) {
      const inputGroup = invalidElement.closest('.input-group, .input-group-omb');
      if (inputGroup) {
        const input = inputGroup.querySelector('input, select, .omb-autocomplete, .cke, .form-action');
        if (input) {
          scrollTo(input, 200);
          input.focus();
        }
      }
    }
  }, 100);
};

FormComponent.propTypes = {
  config: PropTypes.shape({
    buttons: PropTypes.arrayOf(PropTypes.shape({
      size: PropTypes.string,
      color: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
      text: PropTypes.string,
      type: PropTypes.string,
      disabled: PropTypes.bool,
      title: PropTypes.string,
    })),
    onSubmit: PropTypes.func,
    additionalValidation: PropTypes.func,
    defaultOnChange: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    formGroups: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      formGroups: PropTypes.array,
    })),
    groupsAsColumns: PropTypes.bool,
    noCards: PropTypes.bool,
    stickyTitle: PropTypes.bool,
    translateTitle: PropTypes.bool,
    title: PropTypes.string,
    isInPopup: PropTypes.bool,
    togglePopup: PropTypes.func,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  id: PropTypes.string.isRequired,
};

FormComponent.defaultProps = {
  data: {},
  config: {},
};
