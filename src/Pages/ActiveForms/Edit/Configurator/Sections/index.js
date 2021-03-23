import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { CONTENT_SECTION_TYPE, FORM_SECTION_TYPE, HEADER_SECTION_TYPE } from '../../utils/consts';
import HeaderSection from './Header';
import ContentSection from './Content';
import FormSection from './Form';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import __ from '../../../../../utils/Translations';
import ConfiguratorContext from '../../utils/configuratorContext';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';

export default function Section({ index, section }) {
  const { type, id, ...sectionData } = section;
  const {
    deleteSection, addFieldToForm, moveSectionUp, moveSectionDown, sectionsCount, isDefaultLanguage,
  } = useContext(ConfiguratorContext);
  let sectionComponent = null;
  let title = '';
  if (type === HEADER_SECTION_TYPE) {
    sectionComponent = <HeaderSection key={`section_header_${index}`} value={sectionData.value} index={index} id={id} />;
    title = 'Nagłówek';
  } else if (type === FORM_SECTION_TYPE) {
    sectionComponent = <FormSection key={`section_form_${index}`} fields={sectionData.fields} index={index} id={id} />;
    title = 'Formularz';
  } else if (type === CONTENT_SECTION_TYPE) {
    sectionComponent = (
      <ContentSection
        key={`section_content_${index}`}
        name={sectionData.name}
        content={sectionData.content}
        useCheckbox={sectionData.useCheckbox}
        checkboxRequired={sectionData.checkboxRequired}
        index={index}
        id={id}
      />
    );
    title = 'Treść';
  }
  if (sectionComponent === null) {
    return null;
  }
  return (
    <div className="m-1 p-4 border border-dashed rounded">
      <div className="row">
        <div className="card-header-title font-size-lg font-weight-normal">
          #
          {index + 1}
          {' '}
          {__(title) }
        </div>
        <div className="btn-actions-pane-right">
          {type === FORM_SECTION_TYPE ? (
            <RbsButton
              data-t1="addFormField"
              disabled={!isDefaultLanguage}
              color="link"
              className="ml-1"
              onClick={() => addFieldToForm(id)}
            >
              {__('Dodaj pole')}
            </RbsButton>
          ) : null}
          <RbsButton
            data-t1="deleteSection"
            disabled={!isDefaultLanguage}
            color="link"
            className="ml-1"
            onClick={() => getUserConfirmationPopup(
              __('Akcja spowoduje usuniecie sekcji {0}', [title]),
              (confirm) => confirm && deleteSection(id),
              __('Czy na pewno chcesz usunąć sekcję?'),
            )}
          >
            {__('Usuń')}
          </RbsButton>
          <RbsButton
            data-t1="moveSectionUp"
            color="link"
            className="ml-1"
            disabled={!isDefaultLanguage || index === 0}
            onClick={() => moveSectionUp(index)}
          >
            {__('Przenieś wyżej')}
          </RbsButton>
          <RbsButton
            data-t1="moveSectionDown"
            color="link"
            className="ml-1"
            disabled={!isDefaultLanguage || (index + 1 >= sectionsCount)}
            onClick={() => moveSectionDown(index)}
          >
            {__('Przenieś niżej')}
          </RbsButton>
        </div>
      </div>
      <div>
        {sectionComponent}
      </div>
    </div>
  );
}

Section.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    checkboxRequired: PropTypes.bool,
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    value: PropTypes.string,
    useCheckbox: PropTypes.bool,
    content: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
