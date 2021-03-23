import PropTypes from 'prop-types';
import React from 'react';

import DataTable from '../../../../../../../../Components/DataTable';
import { getEditableCell, getToggleSwitchCell } from '../../../../../../../../Components/DataTable/editableCells';
import { booleanOptions, SelectFilter } from '../../../../../../../../Components/DataTable/filters';

export default function Groups({ data, updateData, options }) {
  const listingData = options.map(({ value: id, label: name }) => {
    const { enabled = false, amount = null } = data.find(({ id: elId }) => elId === id) || {};
    return {
      id, name, enabled, amount,
    };
  });

  return (
    <>
      <DataTable
        id="periodicChargeUpEmployeeGroupListing"
        columns={columns(listingData, updateData)}
        data={listingData}
        showPagination
        filterable
      />
    </>
  );
}

const isAmountCellDisabled = (cellInfo) => !cellInfo.row.enabled;

const columns = (data, updateData) => [
  {
    Header: 'Nazwa grupy',
    accessor: 'name',
  },
  {
    Header: 'Użyj',
    accessor: 'enabled',
    Filter: SelectFilter(booleanOptions, false),
    Cell: getToggleSwitchCell(data, updateData),
  },
  {
    Header: 'Kwota',
    accessor: 'amount',
    Cell: getEditableCell(data, updateData, 'number', isAmountCellDisabled),
  },

];

Groups.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateData: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
};
