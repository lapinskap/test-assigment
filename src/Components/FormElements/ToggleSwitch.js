import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Switch from 'react-switch';
import { Row, Col, Label } from 'reactstrap';

const ToggleSwitch = ({
  checked = false, handleChange, label, disabled = false, tooltip, id, afterLabel,
}) => {
  const [mockCheck, setMockCheck] = useState(false);

  const isChecked = handleChange ? checked : mockCheck;
  const onChange = handleChange || setMockCheck;

  if (!label) {
    return (
      <Switch
        checked={isChecked}
        onChange={onChange}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={30}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        disabled={disabled}
        height={20}
        width={48}
        className="mr-2 mb-2"
        id={id}
      />
    );
  }
  return (
    <Row>
      <Col sm={{ size: 'auto' }} className="switch-padding" data-t1={id}>
        <Switch
          data-t1={id}
          checked={isChecked}
          onChange={onChange}
          onColor="#86d3ff"
          disabled={disabled}
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="mr-2 mb-2"
          id={id}
        />
      </Col>
      <Col sm={{ size: 'auto' }} className="switch-padding label">
        <Label className="mt-1">
          {label}
        &nbsp;
          {tooltip}
        </Label>
      </Col>
      {afterLabel ? <Col sm={{ size: 'auto' }} className="ml-3">{afterLabel}</Col> : null}
    </Row>
  );
};

export default ToggleSwitch;

ToggleSwitch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltip: PropTypes.node,
  afterLabel: PropTypes.node,
  id: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  checked: false,
  disabled: false,
  handleChange: null,
  label: '',
  tooltip: null,
  afterLabel: null,
  id: 'material-switch',
};
