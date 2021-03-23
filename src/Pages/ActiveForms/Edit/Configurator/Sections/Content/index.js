import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';
import hashInputId from '../../../../../../utils/jsHelpers/hashInputId';
import ConfiguratorContext from '../../../utils/configuratorContext';
import __ from '../../../../../../utils/Translations';
import Wysiwyg from '../../../../../../Components/FormElements/Wysiwyg';
import { getErrorForField } from '../../validation';
import ValidationMessage from '../../../../../../Components/Form/ValidationMessage';

export default function ContentSection({
  index, id: sectionId, name, content, useCheckbox, checkboxRequired,
}) {
  const nameId = hashInputId(`content_name_${index}`);
  const contentId = hashInputId(`content_content_${index}`);
  const {
    updateSection, isDefaultLanguage, errors, validateField, translations,
  } = useContext(ConfiguratorContext);
  const validate = isDefaultLanguage;

  const nameErrorMessage = validate ? getErrorForField(errors, sectionId, 'name') : null;
  const contentErrorMessage = validate ? getErrorForField(errors, sectionId, 'content') : null;

  let nameValue;
  let contentValue;
  if (isDefaultLanguage) {
    nameValue = name;
    contentValue = content;
  } else {
    nameValue = translations && translations[sectionId] ? translations[sectionId].name : '';
    contentValue = translations && translations[sectionId] ? translations[sectionId].content : '';
  }

  return (
    <div>
      <FormGroup className="input-group-omb">
        <Label for={nameId}>
          {__('Nazwa')}
          :
          {' '}
          {validate ? <span className="text-danger">*</span> : null }
        </Label>
        <Input
          type="text"
          onBlur={() => validateField(sectionId, 'name', nameValue)}
          invalid={Boolean(nameErrorMessage)}
          name={nameId}
          id={nameId}
          value={nameValue}
          onChange={(e) => updateSection(sectionId, 'name', e.target.value)}
        />
        <ValidationMessage message={nameErrorMessage} />
      </FormGroup>
      <FormGroup>
        <Label for={contentId}>
          {__('Zawartość')}
          :
          {' '}
          {validate ? <span className="text-danger">*</span> : null }
        </Label>
        <Wysiwyg
          errorMessage={contentErrorMessage}
          validateField={(id, data) => (validate ? validateField(sectionId, 'content', data) : null)}
          id={contentId}
          value={contentValue}
          onChange={(id, value) => updateSection(sectionId, 'content', value)}
        />
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input
            disabled={!isDefaultLanguage}
            type="checkbox"
            checked={useCheckbox}
            onChange={(e) => updateSection(sectionId, 'useCheckbox', e.target.checked)}
          />
          {' '}
          {__('Dodaj checkbox przy treści')}
        </Label>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input
            disabled={!isDefaultLanguage || !useCheckbox}
            type="checkbox"
            checked={useCheckbox && checkboxRequired}
            onChange={(e) => updateSection(sectionId, 'checkboxRequired', e.target.checked)}
          />
          {' '}
          {__('Oznacz checkbox jako obowiązkowy')}
        </Label>
      </FormGroup>
    </div>
  );
}

ContentSection.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  content: PropTypes.string,
  useCheckbox: PropTypes.bool,
  checkboxRequired: PropTypes.bool,
  index: PropTypes.number.isRequired,
};
ContentSection.defaultProps = {
  name: '',
  content: '',
  useCheckbox: false,
  checkboxRequired: false,
};
