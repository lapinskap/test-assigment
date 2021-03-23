import PropTypes from 'prop-types';
import React from 'react';
import __ from '../../utils/Translations';
import FilterDateRange from './FilterDateRange';
import Autocomplete from '../FormElements/Autocomplete/Autocomplete';

export const defaultFilterMethod = ({ id, value, pivotId }, row) => {
  if (!value) {
    return true;
  }
  const rowId = pivotId || id;
  const rowValue = row[rowId];
  if (Array.isArray(rowValue)) {
    return rowValue.map((el) => String(el).toLowerCase()).includes(String(value).toLowerCase());
  }
  return String(rowValue) && String(rowValue).toLowerCase().includes(String(value).toLowerCase());
};

export const SelectFilter = (options, submitForm = true) => ({ filter, onChange, column }) => {
  const optionsArray = options
    .map(({ label, value }) => <option key={value} value={value}>{__(label)}</option>);
  optionsArray.unshift(<option value="" key="empty-option">---</option>);
  return (
    <select
      data-t1="gridFilter"
      data-t2={column.id}
      className="form-control"
      value={filter ? filter.value : 0}
      onChange={(e) => {
        onChange(e.target.value);
        if (submitForm && e.target.form) {
          const submitButton = e.target.form.querySelector('button[type="submit"]');
          setTimeout(() => {
            submitButton.click();
          }, 10);
        }
      }}
    >
      {optionsArray}
    </select>
  );
};

export const AutocompleteSelectFilter = (options, submitForm = true) => ({ filter, onChange, column }) => (
  <Autocomplete
    id={column.id}
    options={options}
    classNamePrefix="gridFilterAutocomplete"
    value={filter ? filter.value : 0}
    onChange={(selected) => {
      onChange(selected?.value || '');
      if (submitForm) {
        const form = document.getElementById(column.id).closest('form');
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]');
          setTimeout(() => {
            submitButton.click();
          }, 10);
        }
      }
    }}
  />
);

export const DefaultFilter = ({ filter, onChange, column }) => (
  <input
    data-t1="gridFilter"
    data-t2={column.id}
    type="text"
    style={{
      width: '100%',
    }}
    placeholder={column.Placeholder}
    value={filter ? filter.value : ''}
    onChange={(event) => onChange(event.target.value)}
  />
);

DefaultFilter.propTypes = {
  filter: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
  }),
  onChange: PropTypes.func.isRequired,
  column: PropTypes.shape({
    id: PropTypes.string,
    Placeholder: PropTypes.string,
  }).isRequired,
};

DefaultFilter.defaultProps = {
  filter: null,
};

export const IntIdFilter = ({ filter, onChange, column }) => (
  <input
    data-t1="gridFilter"
    data-t2={column.id}
    type="text"
    style={{
      width: '100%',
    }}
    placeholder={column.Placeholder}
    value={filter ? filter.value : ''}
    onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
  />
);

IntIdFilter.propTypes = {
  filter: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
  }),
  onChange: PropTypes.func.isRequired,
  column: PropTypes.shape({
    id: PropTypes.string,
    Placeholder: PropTypes.string,
  }).isRequired,
};

IntIdFilter.defaultProps = {
  filter: null,
};

export const getArraySelectFilterMethod = (forceNumber = false) => ({ id, value }, row) => {
  if (!value) {
    return true;
  }
  return Array.isArray(row[id]) ? row[id].includes(forceNumber ? +value : value) : false;
};

export const booleanOptions = [{
  value: false,
  label: 'Nie',
}, {
  value: true,
  label: 'Tak',
}];

export const DateFilter = (hasTimeSelect = false) => ({ filter, onChange, column }) => (
  <FilterDateRange
    id={column.id}
    showTimeSelect={hasTimeSelect}
    value={filter ? filter.value : { from: '', to: '' }}
    onChange={onChange}
  />
);

export const dateFilterMethod = ({ id, value }, row) => {
  if (!value || (!value.to && !value.from)) {
    return true;
  }
  if (!row[id]) {
    return false;
  }

  const rowValue = new Date(row[id]);

  if (value.from && (new Date(value.from) > rowValue)) {
    return false;
  }

  if (value.to && (new Date(value.to) < rowValue)) {
    return false;
  }

  return true;
};

export const objectStatusOptions = [
  {
    value: 'active', label: 'Aktywny',
  },
  {
    value: 'inactive', label: 'Nieaktywny',
  },
  {
    value: 'new', label: 'Nowy',
  },
];

export const activeBooleanOptions = [{
  value: true,
  label: 'Aktywna',
}, {
  value: false,
  label: 'Nieaktywna',
}];
