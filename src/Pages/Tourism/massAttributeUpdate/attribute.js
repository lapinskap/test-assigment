import React, { useState } from 'react';
import { CustomInput, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';

export default function Attribute({
  id, type, label,
}) {
  const [isDisabled, setIsDisabled] = useState(true);

  const handleDisableInput = (e) => {
    if (!e.target.checked) { setIsDisabled(true); } else {
      setIsDisabled(false);
    }
  };

  return (
    <div className="col-sm-12 row mb-3">
      <FormGroup check className="col-sm-12">
        <Label className="mr-3 col-sm-5" for={id}>{label}</Label>
        <CustomInput type={type} className="col-sm-6" id={id} disabled={isDisabled} label={label} />
      </FormGroup>
      <FormGroup className="ml-3" check>
        <CustomInput onClick={(e) => handleDisableInput(e)} type="checkbox" id={`${id}Change`} label="Zmień" />
      </FormGroup>
    </div>
  );
}

Attribute.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
