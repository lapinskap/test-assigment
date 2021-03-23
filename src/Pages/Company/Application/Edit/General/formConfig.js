import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../Components/DataTable';
import { getEditableCell, getEditableSelectCell } from '../../../../../Components/DataTable/editableCells';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';

export default function FormConfig({ onChange, data, errorMessage }) {
  const updateData = (formData) => {
    onChange('formFieldsConfiguration', formData);
  };
  const addRow = () => {
    data.push({
      type: 'text',
      id: new Date().getTime(),
    });
    updateData([...data]);
  };
  return (
    <>
      <DataTable
        id="applicationConfigListing"
        className={errorMessage ? 'table-invalid' : ''}
        key={data.length}
        noCards
        columns={columns(data, updateData)}
        data={[...data.map((item) => ({ ...item }))]}
        filterable={false}
        showPagination={false}
        buttons={[
          {
            onClick: addRow,
            text: '+ Dodaj pole',
            id: 'employeeFormConfigAdd',
            color: 'primary',
          },
        ]}
      />
      <div className="invalid-feedback" style={{ display: 'block' }}>{errorMessage}</div>
    </>
  );
}

const columns = (data, updateData) => [
  {
    Header: 'Typ pola',
    accessor: 'type',
    Cell: getEditableSelectCell(data, updateData, [
      {
        value: 'text',
        label: 'Pole tekstowe',
      },
      {
        value: 'telephone',
        label: 'Numer telefonu',
      },
      {
        value: 'email',
        label: 'Adres e-mail',
      },
      {
        value: 'date',
        label: 'Data',
      },
      {
        value: 'dateRangeFuture',
        label: 'Zakres dat (tylko w przyszłości)',
      },
      {
        value: 'dateRange',
        label: 'Zakres dat (dowolny)',
      },
      {
        value: 'number',
        label: 'Liczba',
      },
    ]),
  },
  {
    Header: 'Etykieta',
    accessor: 'label',
    Cell: getEditableCell(data, updateData, 'text', null, 'company_application_config_label'),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    Cell: (rowData) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={rowData.row._original}
          buttons={[
            {
              id: 'employeeFormConfigDelete',
              onClick: () => {
                updateData(data.filter((item) => item.id !== rowData.row._original.id));
              },
              color: 'link',
              label: 'Usuń',
            },
          ]}
        />
      </div>
    ),
  },
];
FormConfig.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

FormConfig.defaultProps = {
  errorMessage: '',
};
