import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader } from 'reactstrap';
import { CONTENT_SECTION_TYPE, FORM_SECTION_TYPE, HEADER_SECTION_TYPE } from '../utils/consts';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import __ from '../../../../utils/Translations';
import Section from './Sections';
import ConfiguratorContext from '../utils/configuratorContext';
import arrayMove from '../../../../utils/jsHelpers/arrayMove';
import { getRandomId } from '../utils/utils';

export default function Configurator({
  configuration, update, isDefaultLanguage, errors, validateField, validateFormField, translations,
}) {
  const addSection = (type) => update([...configuration, { type, id: getRandomId() }]);

  const updateSection = (sectionId, field, value) => {
    if (isDefaultLanguage) {
      const updatedValue = [...configuration];
      const section = updatedValue.find(({ id }) => id === sectionId);
      if (section) {
        const index = updatedValue.indexOf(section);
        section[field] = value;
        updatedValue[index] = { ...section };
      }
      update(updatedValue);
    } else {
      const updatedTranslations = { ...(translations || {}) };
      const section = updatedTranslations[sectionId] || {};

      updatedTranslations[sectionId] = { ...section, [field]: value };
      update(updatedTranslations);
    }
  };

  const deleteSection = (id) => update(configuration.filter((el) => id !== el.id));

  const move = async (currentIndex, offset) => {
    const newIndex = currentIndex + offset;
    arrayMove(configuration, currentIndex, newIndex);
    update(configuration.map((section) => ({ ...section })));
  };

  const moveSectionUp = (index) => move(index, -1);
  const moveSectionDown = (index) => move(index, 1);
  const addFieldToForm = (sectionId) => {
    const section = configuration.find(({ id }) => id === sectionId);
    if (section?.type === FORM_SECTION_TYPE) {
      if (!Array.isArray(section.fields)) {
        section.fields = [];
      }
      section.fields.push({
        id: getRandomId(),
      });
      updateSection(sectionId, 'fields', [...section.fields]);
      validateField(section.id, 'fields', section.fields, __('Sekcja nie może być pusta'));
    }
  };

  return (
    <div className="mt-3">
      <CardHeader className="text-transform-none">
        <div className="card-header-title font-size-lg font-weight-normal">
          {__('Konfigurator formularza')}
        </div>
        <div className="btn-actions-pane-right">
          <RbsButton
            disabled={!isDefaultLanguage}
            data-t1="addForm"
            className="ml-2"
            onClick={() => addSection(FORM_SECTION_TYPE)}
          >
            +
            {__('Dodaj sekcje')}
          </RbsButton>
          <RbsButton
            disabled={!isDefaultLanguage}
            data-t1="addHeader"
            className="ml-2"
            onClick={() => addSection(HEADER_SECTION_TYPE)}
          >
            +
            {__('Dodaj nagłówek')}
          </RbsButton>
          <RbsButton
            disabled={!isDefaultLanguage}
            data-t1="addContent"
            className="ml-2"
            onClick={() => addSection(CONTENT_SECTION_TYPE)}
          >
            +
            {__('Dodaj treść')}
          </RbsButton>
        </div>
      </CardHeader>
      <div className="text-right" />
      <ConfiguratorContext.Provider value={{
        deleteSection,
        updateSection,
        addFieldToForm,
        moveSectionDown,
        moveSectionUp,
        validateField,
        validateFormField,
        errors,
        isDefaultLanguage,
        translations,
        sectionsCount: configuration.length,
      }}
      >
        {configuration?.map((section, index) => (
          <Section
            key={`section_${index}`}
            section={section}
            index={index}
          />
        ))}
      </ConfiguratorContext.Provider>
    </div>
  );
}

Configurator.propTypes = {
  configuration: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    checkboxRequired: PropTypes.bool,
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    value: PropTypes.string,
    useCheckbox: PropTypes.bool,
    content: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  })),
  update: PropTypes.func.isRequired,
  isDefaultLanguage: PropTypes.bool.isRequired,
  validateField: PropTypes.func.isRequired,
  validateFormField: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  translations: PropTypes.shape({}),
};

Configurator.defaultProps = {
  configuration: [],
  errors: null,
  translations: null,
};
