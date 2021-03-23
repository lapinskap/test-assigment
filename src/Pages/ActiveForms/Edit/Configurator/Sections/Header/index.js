import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import hashInputId from '../../../../../../utils/jsHelpers/hashInputId';
import ConfiguratorContext from '../../../utils/configuratorContext';
import __ from '../../../../../../utils/Translations';
import ValidationMessage from '../../../../../../Components/Form/ValidationMessage';
import { getErrorForField } from '../../validation';

export default function HeaderSection({ value, index, id: sectionId }) {
  const fieldId = hashInputId(`header_input_${index}`);
  const {
    updateSection, errors, validateField, isDefaultLanguage, translations,
  } = useContext(ConfiguratorContext);
  const validate = isDefaultLanguage;
  const errorMessage = validate ? getErrorForField(errors, sectionId, 'value') : null;

  let formValue;
  if (isDefaultLanguage) {
    formValue = value;
  } else {
    formValue = translations && translations[sectionId] ? translations[sectionId].value : '';
  }

  return (
    <FormGroup className="input-group-omb">
      <Label for={fieldId}>
        {__('Treść nagłówka')}
        :
        {' '}
        {validate ? <span className="text-danger">*</span> : null }
      </Label>
      <Input
        type="text"
        name={fieldId}
        onBlur={() => (validate ? validateField(sectionId, 'value', formValue) : null)}
        invalid={Boolean(errorMessage)}
        id={fieldId}
        value={formValue}
        onChange={(e) => updateSection(sectionId, 'value', e.target.value)}
      />
      <ValidationMessage message={errorMessage} />
    </FormGroup>
  );
}

HeaderSection.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  index: PropTypes.number.isRequired,
};

HeaderSection.defaultProps = {
  value: '',
};
