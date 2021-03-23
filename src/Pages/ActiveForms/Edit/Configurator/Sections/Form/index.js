import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';
import ConfiguratorContext from '../../../utils/configuratorContext';
import {
  IsRequiredColumn,
  LabelColumn,
  RequirementDependencyColumn,
  TooltipColumn,
  TypeColumn,
} from './fields';
import __ from '../../../../../../utils/Translations';
import arrayMove from '../../../../../../utils/jsHelpers/arrayMove';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { getErrorForField } from '../../validation';
import ValidationMessage from '../../../../../../Components/Form/ValidationMessage';

export default function FormSection({ fields, index, id: sectionId }) {
  const {
    updateSection, isDefaultLanguage, errors, validateFormField, validateField, translations,
  } = useContext(ConfiguratorContext);
  const updateFields = (data) => updateSection(sectionId, 'fields', data);

  const updateRow = (rowIndex, value) => {
    if (isDefaultLanguage) {
      const newFields = [...fields];
      newFields[rowIndex] = value;
      updateFields(newFields);
    } else {
      const fieldId = fields[rowIndex]?.id;
      if (fieldId) {
        const updatedTranslation = { ...(translations || {}) };
        const updatedFieldsTranslations = updatedTranslation[sectionId]?.fields || {};
        const fieldTranslations = updatedFieldsTranslations[fieldId] || {};
        fieldTranslations.label = value.label || '';
        fieldTranslations.tooltip = value.tooltip || '';
        updatedFieldsTranslations[fieldId] = { ...fieldTranslations };
        updateFields({ ...updatedFieldsTranslations });
      }
    }
  };

  const dependencyOptions = fields.map(({ id, label }) => ({ value: id, label: `${id} ${label ? `(${label})` : ''}` }));
  const fieldsError = getErrorForField(errors, sectionId, 'fields');
  const move = async (currentIndex, offset) => {
    const newIndex = currentIndex + offset;
    arrayMove(fields, currentIndex, newIndex);
    updateFields(fields.map((section) => ({ ...section })));
  };
  const moveFieldUp = (fieldIndex) => move(fieldIndex, -1);
  const moveFieldDown = (fieldIndex) => move(fieldIndex, 1);

  const fieldsTableData = isDefaultLanguage ? fields : fields.map(({
    label, tooltip, id, ...fieldData
  }) => ({
    ...fieldData,
    id,
    label: translations && translations[sectionId] ? translations[sectionId]?.fields[id]?.label : '',
    tooltip: translations && translations[sectionId] ? translations[sectionId]?.fields[id]?.tooltip : '',
    labelOriginal: label,
    tooltipOriginal: tooltip,
  }));
  return (
    <div className="input-group-omb">
      <DataTable
        id={`formSectionFields${index}`}
        key={`formSectionFields_${fields.length}`}
        data={fieldsTableData}
        className={`form-action${fieldsError ? ' border border-danger' : ''}`}
        showPagination={false}
        sortable={false}
        filterable={false}
        columns={[
          {
            Header: 'ID pola',
            accessor: 'id',
            width: 80,
          },
          {
            Header: 'Etykieta',
            accessor: 'label',
            Cell: LabelColumn,
            getProps: () => ({
              updateRow, errors, validateFormField, sectionId, isDefaultLanguage,
            }),
          },
          {
            Header: 'Typ pola',
            accessor: 'type',
            getProps: () => ({ updateRow, isDisabled: !isDefaultLanguage }),
            Cell: TypeColumn,
          },
          {
            Header: 'Zależność obowiązkowości',
            accessor: 'requirementDependency',
            getProps: () => ({ updateRow, isDisabled: !isDefaultLanguage, options: dependencyOptions }),
            Cell: RequirementDependencyColumn,
          },
          {
            Header: 'Obowiązkowość',
            accessor: 'require',
            getProps: () => ({ updateRow, isDisabled: !isDefaultLanguage, options: dependencyOptions }),
            Cell: IsRequiredColumn,
          },
          {
            Header: 'Tooltip',
            accessor: 'tooltip',
            getProps: () => ({ updateRow, isDefaultLanguage }),
            Cell: TooltipColumn,
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            Cell: (cellInfo) => {
              const rowId = cellInfo.row._original.id;
              const rowIndex = cellInfo.index;
              const dependedField = fields.find(({ requirementDependency }) => requirementDependency === rowId);
              const cannotDelete = Boolean(dependedField);
              return (
                <div className="d-block w-100 text-center">
                  <ActionColumn
                    data={cellInfo.row._original}
                    buttons={[
                      {
                        id: 'deleteField',
                        disabled: cannotDelete || !isDefaultLanguage,
                        title: cannotDelete ? __('Inne pole jest zależne od tego pola') : null,
                        color: 'link',
                        label: __('Usuń'),
                        onClick: () => {
                          const newFields = fields.filter((item) => item.id !== rowId);
                          updateFields(newFields);
                          validateField(sectionId, 'fields', newFields.length, __('Sekcja nie może być pusta'));
                        },
                      },
                      {
                        id: 'moveUp',
                        disabled: rowIndex <= 0 || !isDefaultLanguage,
                        color: 'link',
                        label: __('Przesuń wyżej'),
                        onClick: () => moveFieldUp(rowIndex),
                      },
                      {
                        id: 'moveDown',
                        disabled: rowIndex + 1 >= fields.length || !isDefaultLanguage,
                        color: 'link',
                        label: __('Przesuń niżej'),
                        onClick: () => moveFieldDown(rowIndex),
                      },
                    ]}
                  />
                </div>
              );
            },
          },
        ]}
      />
      <ValidationMessage message={fieldsError} />
    </div>
  );
}

FormSection.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})),
};

FormSection.defaultProps = {
  fields: [],
};
