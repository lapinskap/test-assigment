import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { Input, InputGroup } from 'reactstrap';
import __ from '../../utils/Translations';
import arrayUnique from '../../utils/jsHelpers/arrayUnique';
import ValidationMessage from '../Form/ValidationMessage';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';
import { hasAccessTo } from '../../utils/RoleBasedSecurity/filters';

export function MassActionsSelect({
  massActions, filters, excluded, included, count,
}) {
  const [error, setError] = useState('');
  const { userInfo } = useContext(RbsContext);
  useEffect(() => {
    if (count > 0) {
      setError('');
    }
  }, [count, setError]);

  return (
    <InputGroup className="mb-2 mt-2">
      <Input
        type="select"
        name="select"
        data-t1="massActions"
        value=""
        className={`${error ? ' is-invalid-select col-sm-4' : 'col-sm-4'}`}
        onChange={(e) => {
          const { value } = e.target;
          if (value) {
            if (count > 0) {
              massActions.find(({ id }) => id === value).action(included, excluded, filters, count);
            } else {
              setError(__('Nie wybrałeś żadnych obiektów'));
            }
          }
        }}
      >
        {
          [{
            value: '',
            label: __('--- Akcje masowe ---'),
            action: () => {
            },
          }]
            .concat(massActions)
            .map(({ label, permission, id }, key) => {
              const disabled = permission && !hasAccessTo(userInfo, permission);
              return (
                <option disabled={disabled} key={id || key} value={id}>
                  {__(label)}
                </option>
              );
            })
        }
      </Input>
      {count > 0 ? (
        <span className="m-2">
          {__('Zaznaczono')}
          :
          {' '}
          {count}
        </span>
      ) : null}
      <ValidationMessage message={error} />
    </InputGroup>
  );
}

export const SELECT_ALL = 'selectAll';
export const SELECT_PAGE_ALL = 'selectPageAll';
export const DESELECT_ALL = 'deselectAll';
export const DESELECT_PAGE_ALL = 'deselectPageAll';

const rowSelectOptions = [
  {
    value: '',
    label: '-',
  },
  {
    value: SELECT_ALL,
    label: 'Zaznacz wszystkie',
  },
  {
    value: SELECT_PAGE_ALL,
    label: 'Zazanacz wszystkie na tej stronie',
  },
  {
    value: DESELECT_ALL,
    label: 'Odznacz wszystkie',
  },
  {
    value: DESELECT_PAGE_ALL,
    label: 'Odznacz wszystkie na tej stronie',
  },
];

MassActionsSelect.propTypes = {
  massActions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func,
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
  })).isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  count: PropTypes.number.isRequired,
  excluded: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  included: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]).isRequired,
};

export function getRowSelectColumn(rowId, pageIds, included, excluded, updateMassActionSelection) {
  return {
    accessor: 'checkbox',
    maxWidth: 40,
    sortable: false,
    Filter: () => (
      <select
        data-t1="massActionSelect"
        className="form-control"
        value=""
        onChange={(e) => {
          const selectAll = included === true;
          let newExcluded = [...excluded];
          let newIncluded = selectAll ? included : [...included];
          switch (e.target.value) {
            case SELECT_ALL:
              newIncluded = true;
              newExcluded = [];
              break;
            case SELECT_PAGE_ALL:
              if (selectAll) {
                newExcluded = newExcluded.filter((el) => !pageIds.includes(el));
              } else {
                newIncluded = newIncluded.concat(pageIds)
                  .filter(arrayUnique);
                newExcluded = newExcluded.filter((el) => !pageIds.includes(el));
              }
              break;
            case DESELECT_ALL:
              newIncluded = [];
              newExcluded = [];
              break;
            case DESELECT_PAGE_ALL:
              if (selectAll) {
                newExcluded = newExcluded.concat(pageIds)
                  .filter(arrayUnique);
              } else {
                newExcluded = newExcluded.concat(pageIds)
                  .filter(arrayUnique);
                newIncluded = newIncluded.filter((el) => !pageIds.includes(el));
              }
              break;
            default:
          }
          updateMassActionSelection(newIncluded, newExcluded);
        }}
      >
        {rowSelectOptions.map(({ label, value }) => (
          <option value={value} key={value}>
            {__(label)}
          </option>
        ))}
      </select>
    ),
    Cell: (rowData) => {
      const id = rowData.row._original[rowId];
      const selectAll = included === true;
      const isChecked = (selectAll && !excluded.includes(id)) || (!selectAll && included.includes(id));
      return (
        <div className="d-block w-100 text-center">
          <input
            data-t1="massActionCheckbox"
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              let newExcluded = [...excluded];
              let newIncluded = selectAll ? included : [...included];
              if (isChecked) {
                if (selectAll) {
                  newExcluded.push(id);
                } else {
                  newIncluded = newIncluded.filter((el) => el !== id);
                }
              } else {
                // eslint-disable-next-line no-lonely-if
                if (selectAll) {
                  newExcluded = newExcluded.filter((el) => el !== id);
                } else {
                  newIncluded.push(id);
                }
              }
              updateMassActionSelection(newIncluded, newExcluded);
            }}
          />
        </div>
      );
    },
  };
}
