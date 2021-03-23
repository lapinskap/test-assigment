import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { CardHeader, Card } from 'reactstrap';
import { SelectFilter } from '../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import ToggleSwitch from '../../../../../Components/FormElements/ToggleSwitch';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import BusinessIdColumn from '../../../../../Components/DataTable/businessIdColumn';
import __ from '../../../../../utils/Translations';
import DataTableControlled, { getListingData } from '../../../../../Components/DataTableControlled';
import { EMPLOYEE_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { mockData } from '../../CompanyEmployees/List/list';
import { getIdFromIri, getIriFromId } from '../../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX } from '../../../../../utils/hooks/company/useEmployees';

export default function EmployeesTable({
  data, companyId, update,
}) {
  const [employees, setEmployees] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const realFilters = filters.reduce((result, filter) => {
      if (filter.id === 'selected') {
        if (filter.value === 'true') {
          result.push({
            id: 'id',
            value: data.map((iri) => getIdFromIri(iri, IRI_PREFIX)),
          });
        }
      } else {
        result.push(filter);
      }
      return result;
    }, []);
    const { data: newData, count: newCount } = await getListingData(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees',
      [
        ...realFilters,
        {
          id: 'companyId',
          value: companyId,
        },
      ],
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setCount(newCount);
    setEmployees(newData);
  }, [companyId, data]);
  useEffect(() => {
    setTableData(employees.map((el) => ({
      ...el,
      selected: data.includes(getIriFromId(el.id, IRI_PREFIX)),
    })));
  }, [employees, data]);

  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, true, !companyId);

  const toggleActive = (id, selected) => {
    const iri = getIriFromId(id, IRI_PREFIX);
    if (selected) {
      if (!data.includes(iri)) {
        data.push(iri);
        update([...data]);
      }
    } else {
      update(data.filter((el) => el !== iri));
    }
  };
  return (
    <Card>
      <CardHeader>
        {' '}
        {__('Pracownicy')}
        (
        {data.length}
        )
        :
      </CardHeader>
      <div className="pt-2">
        <DataTableControlled
          id="employeesListing"
          data={tableData}
          filterable
          count={count}
          fetchData={fetchData}
          paramsInUrl={false}
          columns={[
            {
              Header: 'ID',
              accessor: 'id',
              Cell: BusinessIdColumn,
            },
            {
              Header: 'Aktywny',
              accessor: 'selected',
              sortable: false,
              Filter: SelectFilter([{
                value: true,
                label: 'Tak',
              }]),
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <ToggleSwitch
                    handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                    checked={Boolean(rowData.row._original.selected)}
                    id={rowData.row._original.id}
                  />
                </div>
              ),
            },
            {
              Header: 'Imię',
              accessor: 'firstName',
            },
            {
              Header: 'Nazwisko',
              accessor: 'lastName',
            },
            {
              Header: 'Grupy pracownicze',
              accessor: 'employeeGroup',
              Filter: SelectFilter(employeeGroups),
              Cell: mapValueFromOptions(employeeGroups, 'employeeGroup'),
            },
          ]}
        />
      </div>
    </Card>
  );
}

EmployeesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  companyId: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};
