import PropTypes from 'prop-types';
import React from 'react';
import { CardHeader, Card, CardBody } from 'reactstrap';
// eslint-disable-next-line import/no-cycle
import FormElement from './FormElement';
import Tooltip from '../Tooltips/defaultTooltip';
import { getLayout } from '../Layouts';

const getValueFromData = (config, data) => {
  switch (config.type) {
    case 'dateRange':
    case 'numberRange':
      return { from: data[`${config.id}From`], to: data[`${config.id}To`] };
    default:
      return data[config.id];
  }
};
export const shouldDisplayElement = (depends, data, displayCondition) => {
  if (displayCondition === false) {
    return false;
  }
  if (!depends) {
    return true;
  }

  if (Array.isArray(depends)) {
    return !depends.find(({ value, field }) => data[field] !== value);
  }
  const { field, value, functionValidation } = depends;
  if (functionValidation) {
    return functionValidation(data);
  }
  return data[field] === value;
};

const formElementsMapper = (formElementConfig, key, data, validateField, invalidFields, defaultOnChange) => {
  const {
    component, onChange, depends, displayCondition, layout, layoutConfig, border, formElements: layoutFromElements, ...restConfig
  } = formElementConfig;

  if (layout) {
    return getLayout(layout, layoutFromElements.map(
      (LayoutElementConfig, elKey) => formElementsMapper(LayoutElementConfig, elKey, data, validateField, invalidFields, defaultOnChange),
    ).filter(Boolean), layoutConfig, key, border);
  }

  if (!shouldDisplayElement(depends, data, displayCondition)) {
    return null;
  }
  if (component) {
    if (restConfig.validation) {
      return React.cloneElement(component, {
        errorMessage: invalidFields[restConfig.id],
        validate: (componentData) => validateField(restConfig.id, componentData, restConfig.validation),
      });
    }
    return component;
  }
  const value = getValueFromData(formElementConfig, data);
  return (
    <FormElement
      /* eslint-disable-next-line react/no-array-index-key */
      key={key}
      value={value}
      validateField={validateField}
      errorMessage={invalidFields[restConfig.id]}
      onChange={onChange || defaultOnChange}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...restConfig}
    />
  );
};

export default function FormGroup({
  title,
  formElements,
  data,
  defaultOnChange,
  noCards,
  tooltip,
  id,
  groupsAsColumns,
  invalidFields,
  validateField,
}) {
  const elements = formElements.map(
    (formElementConfig, key) => formElementsMapper(formElementConfig, key, data, validateField, invalidFields, defaultOnChange),
  );
  switch (true) {
    case noCards:
      return <NoCardWrapper title={title} tooltip={tooltip} id={id}>{elements}</NoCardWrapper>;
    case groupsAsColumns:
      return <NoCardWrapper title={title} tooltip={tooltip} id={id}>{elements}</NoCardWrapper>;
    default:
      return <CardWrapper title={title} tooltip={tooltip} id={id}>{elements}</CardWrapper>;
  }
}

const CardWrapper = ({
  title, children, tooltip, id,
}) => {
  let tooltipComponent;
  if (tooltip) {
    tooltipComponent = <Tooltip id={`form_group_tooltip_${id}`} type={tooltip.type} content={tooltip.content} placement={tooltip.placement} />;
  }
  return (

    <Card className="main-card mb-3">
      {title ? (
        <CardHeader>
          {title}
          {tooltipComponent}
        </CardHeader>
      ) : null}
      <CardBody className="pt-4">
        {children}
      </CardBody>
    </Card>
  );
};

const NoCardWrapper = ({
  title, children, tooltip, id,
}) => {
  let tooltipComponent;
  if (tooltip) {
    tooltipComponent = <Tooltip id={`form_group_tooltip_${id}`} type={tooltip.type} content={tooltip.content} placement={tooltip.placement} />;
  }
  return (

    <div className="main-card mb-3">
      {title ? (
        <CardHeader>
          {title}
          {tooltipComponent}
        </CardHeader>
      ) : null}
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
};

CardWrapper.propTypes = {
  children: PropTypes.node,
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  tooltip: PropTypes.shape({
    content: PropTypes.node,
    type: PropTypes.string,
    placement: PropTypes.string,
  }),
};

NoCardWrapper.propTypes = {
  children: PropTypes.node,
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  tooltip: PropTypes.shape({
    content: PropTypes.node,
    type: PropTypes.string,
    placement: PropTypes.string,
  }),
};

FormGroup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  defaultOnChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  formElements: PropTypes.array,
  id: PropTypes.number,
  noCards: PropTypes.bool,
  title: PropTypes.string,
  tooltip: PropTypes.shape({
    content: PropTypes.node,
    type: PropTypes.string,
  }),
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  invalidFields: PropTypes.object,
  groupsAsColumns: PropTypes.bool,
};

CardWrapper.defaultProps = {
  children: null,
  title: '',
  tooltip: null,
};

NoCardWrapper.defaultProps = {
  children: null,
  title: '',
  tooltip: null,
};

FormGroup.defaultProps = {
  data: {},
  defaultOnChange: () => {
  },
  formElements: [],
  id: 0,
  noCards: false,
  title: '',
  tooltip: null,
  validateField: null,
  invalidFields: null,
  groupsAsColumns: false,
};
