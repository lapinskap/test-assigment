import React from 'react';

const ConfiguratorContext = React.createContext({
  updateSection: (index, field, value) => {},
  deleteSection: (index) => {},
  moveSectionUp: (index) => {},
  moveSectionDown: (index) => {},
  addFieldToForm: (index) => {},
  validateField: (sectionId, field, value) => {},
  validateFormField: (sectionId, fieldId, field, value) => {},
  errors: null,
  isDefaultLanguage: true,
  translation: {},
  sectionsCount: 0,
});

export default ConfiguratorContext;
