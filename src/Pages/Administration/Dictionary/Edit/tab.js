import React from 'react';
import {
  Input, InputGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import arrayMove from '../../../../utils/jsHelpers/arrayMove';
import uniqueId from '../../../../utils/jsHelpers/uniqueId';
import ValidationMessage from '../../../../Components/Form/ValidationMessage';
import { dictionaryDictionaryPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../../Components/DataTable/actionColumn';

export default function LanguageTab({
  updateItems, items, isDefault, lang, errorMessage, validate, isSystemic,
}) {
  const addRow = () => {
    items.push({
      tmpId: uniqueId(),
    });
    updateItems([...items]);
  };
  return (
    <>
      <DataTable
        id="dictionaryItemsListing"
        noCards
        key={items ? items.length : 'tab'}
        data={items ? [...items.map((item) => ({ ...item }))] : []}
        filterable={false}
        showPagination={false}
        buttons={[
          {
            onClick: addRow,
            text: '+ Dodaj pole',
            disabled: !isDefault || isSystemic,
            permission: dictionaryDictionaryPermissionWrite,
            id: 'dictionaryTabAdd',
            color: 'primary',
          },
        ]}
        columns={[
          {
            Header: 'Klucz',
            accessor: 'key',
            Cell: getEditableCell(items, updateItems, !isDefault || isSystemic, errorMessage, validate),
          },
          {
            Header: 'Wartość',
            accessor: isDefault ? 'value' : `value_${lang}`,
            Cell: getEditableCell(items, updateItems, false, errorMessage, validate),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            Cell: (rowData) => (
              <ActionColumn
                data={rowData.row._original}
                buttons={[
                  {
                    permission: dictionaryDictionaryPermissionWrite,
                    id: 'dictionaryItemDelete',
                    className: 'm-1',
                    onClick: () => {
                      updateItems(items.filter((item) => item.tmpId !== rowData.row._original.tmpId));
                    },
                    disabled: !isDefault || isSystemic,
                    color: 'link',
                    label: 'Usuń',
                  },
                  {
                    permission: dictionaryDictionaryPermissionWrite,
                    id: 'dictionaryItemUp',
                    className: 'm-1',
                    color: 'link',
                    onClick: () => {
                      const result = arrayMove(items, rowData.index, rowData.index - 1);
                      updateItems([...result]);
                    },
                    label: <i className="lnr-arrow-up" />,
                    disabled: (rowData.index <= 0) || !isDefault || isSystemic,

                  },
                  {
                    id: 'dictionaryItemDown',
                    permission: dictionaryDictionaryPermissionWrite,
                    className: 'm-1',
                    color: 'link',
                    onClick: () => {
                      const result = arrayMove(items, rowData.index, rowData.index + 1);
                      updateItems([...result]);
                    },
                    label: <i className="lnr-arrow-down" />,
                    disabled: (rowData.index >= items.length - 1) || !isDefault || isSystemic,
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}

const getEditableCell = (data, updateData, disabled = false, errors = null, validate = null) => (cellInfo) => {
  const value = data[cellInfo.index][cellInfo.column.id];
  const { tmpId } = cellInfo.row._original;
  let error = null;
  if (errors && errors[tmpId] && errors[tmpId][cellInfo.column.id]) {
    error = errors[tmpId][cellInfo.column.id];
  }
  return (
    <div className="d-block w-100 text-center">
      <InputGroup>
        <Input
          defaultValue={value}
          type="text"
          invalid={Boolean(error)}
          disabled={disabled}
          onBlur={(e) => {
            const updatedData = [...data];
            updatedData[cellInfo.index][cellInfo.column.id] = e.target.value;
            updateData(updatedData);
            if (validate) {
              validate(updatedData);
            }
          }}
        />
        <ValidationMessage message={error} />
      </InputGroup>
    </div>
  );
};

LanguageTab.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  lang: PropTypes.string.isRequired,
  isDefault: PropTypes.bool.isRequired,
  isSystemic: PropTypes.bool.isRequired,
  updateItems: PropTypes.func.isRequired,
  validate: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  errorMessage: PropTypes.object,
};

LanguageTab.defaultProps = {
  errorMessage: null,
  validate: null,
};
