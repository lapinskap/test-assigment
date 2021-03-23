import PropTypes from 'prop-types';
import React from 'react';
import {
  Input, InputGroup, Label, Row, Col,
} from 'reactstrap';
import DataTable from '../../../../../Components/DataTable';
import { getEditableCheckboxesCell } from '../../../../../Components/DataTable/editableCells';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import useRentableGroups from '../../../../../utils/hooks/company/useRentableGroups';
import __ from '../../../../../utils/Translations';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';

export default function EmployeeGroupConfig({
  onChange, data, companyId, errorMessage,
}) {
  const updateData = (formData) => {
    onChange('financingAmountsConfiguration', formData);
  };
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const rentableGroups = useRentableGroups(true, 'companyId', companyId, false, !companyId);

  const addRow = () => {
    data.push({
      id: new Date().getTime(),
    });
    updateData([...data]);
  };
  return (
    <>
      <DataTable
        id="employeeGroupsConfigListing"
        className={errorMessage ? 'table-invalid' : ''}
        key={data.length}
        noCards
        columns={[
          {
            Header: 'Grupa pracowników',
            accessor: 'group',
            width: 300,
            Cell: getEditableCheckboxesCell(data, updateData, employeeGroups),
          },
          {
            Header: 'Konfiguracja dla grup dochodowości',
            accessor: 'value',
            Cell: getRentableGroupsCellCell(data, updateData, rentableGroups),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            width: 150,
            Cell: (cellInfo) => (
              <div className="d-block w-100 text-center">
                <ActionColumn
                  data={cellInfo.row._original}
                  buttons={[
                    {
                      id: 'employeeGroupConfigDelete',
                      onClick: () => {
                        updateData(data.filter((item) => item.id !== cellInfo.row._original.id));
                      },
                      color: 'link',
                      label: 'Usuń',
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        data={[...data.map((item) => ({ ...item }))]}
        filterable={false}
        showPagination={false}
        buttons={[
          {
            onClick: addRow,
            text: '+ Dodaj pole',
            color: 'primary',
          },
        ]}
      />
      <div className="invalid-feedback" style={{ display: 'block' }}>{errorMessage}</div>
    </>
  );
}

export const getRentableGroupsCellCell = (data, updateData, rentableGroups) => {
  const renderEditable = (cellInfo) => {
    const value = data[cellInfo.index][cellInfo.column.id];
    const groups = [{
      value: 0,
      label: __('Dla wszystkich grup dochodowości'),
    }].concat(rentableGroups);

    groups.push({
      value: -1,
      label: __('Niewybrana grupa dochodowości'),
    });

    return (
      <Row>
        {groups.map(({ value: groupId, label: groupName }) => (
          <InputGroup className="pb-2" key={groupId}>
            <Col sm="4" className="text-left">
              <Label>{groupName}</Label>
            </Col>
            <Col sm="8">
              <Input
                defaultValue={value ? value[groupId] : ''}
                type="text"
                onBlur={(e) => {
                  const updatedData = [...data];
                  if (!updatedData[cellInfo.index][cellInfo.column.id]) {
                    updatedData[cellInfo.index][cellInfo.column.id] = {};
                  }
                  updatedData[cellInfo.index][cellInfo.column.id][groupId] = e.target.value;
                  updateData(updatedData);
                }}
              />
            </Col>
          </InputGroup>
        ))}
      </Row>
    );
  };
  return renderEditable;
};

EmployeeGroupConfig.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

EmployeeGroupConfig.defaultProps = {
  errorMessage: '',
};
