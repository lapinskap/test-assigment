import PropTypes from 'prop-types';
import React from 'react';
import useAhrRoles from '../../../../../../utils/hooks/company/useAhrRoles';
import useAhrs, { IRI_PREFIX } from '../../../../../../utils/hooks/company/useAhrs';
import DataTable from '../../../../../../Components/DataTable';
import { booleanOptions, SelectFilter } from '../../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../../Components/DataTable/commonCells';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';

export default function AdminsTable({
  data, companyId, update,
}) {
  const ahrRoles = useAhrRoles(true, 'companyId', companyId, true, !companyId);
  const administrators = useAhrs(false, 'companyId', companyId, true, !companyId);

  const toggleActive = (id, selected) => {
    if (selected) {
      if (!data.includes(id)) {
        data.push(id);
        update([...data]);
      }
    } else {
      update(data.filter((el) => el !== id));
    }
  };
  return (
    <DataTable
      noCards
      id="ahrListing"
      data={administrators.map((el) => ({
        ...el,
        active: data.includes(el.id),
      }))}
      filterable
      columns={[
        {
          Header: 'Aktywny',
          accessor: 'active',
          Filter: SelectFilter(booleanOptions, false),
          Cell: (rowData) => (
            <div className="d-block w-100 text-center">
              <ToggleSwitch
                handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                checked={Boolean(rowData.row._original.active)}
                id={rowData.row._original.id}
              />
            </div>
          ),
        },
        {
          Header: 'ID',
          accessor: 'id',
          Cell: (rowData) => (
            <div>{rowData.row._original.id.replace(`${IRI_PREFIX}/`, '')}</div>
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
          Header: 'Rola AHR',
          accessor: 'ahrRole',
          Filter: SelectFilter(ahrRoles, false),
          Cell: mapValueFromOptions(ahrRoles, 'ahrRole'),
        },
      ]}
    />
  );
}

AdminsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  companyId: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};
