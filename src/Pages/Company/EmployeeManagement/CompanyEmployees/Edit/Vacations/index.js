import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';
import Form, { vacationOptions } from './form';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import __ from '../../../../../../utils/Translations';
import { getDateCell, mapValueFromOptions } from '../../../../../../Components/DataTable/commonCells';
import { DateFilter, dateFilterMethod, SelectFilter } from '../../../../../../Components/DataTable/filters';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { employeeEmployeeLeavePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';
import BusinessIdColumn from '../../../../../../Components/DataTable/businessIdColumn';

export default function VacationsListing({ employeeId }) {
  const [data, setData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editFormId, setEditFormId] = useState(0);
  const closeForm = useCallback((reload = false) => {
    setEditFormId('0');
    setOpenForm(false);

    if (reload) {
      setData(null);
    }
  }, []);

  const deleteVacation = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        `/employee-leaves/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto urlop'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć urlopu'), 'error');
    }
  };

  return (
    <>
      <DataLoading
        service={EMPLOYEE_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint={`/employee-leaves?employeeId=${employeeId}&itemsPerPage=10000`}
        mockDataEndpoint="/employee/vacations/list"
      >
        <DataTable
          id="employeeLeavesListing"
          key={data ? data.length : 0}
          data={data || []}
          filterable
          buttons={[
            {
              onClick: () => {
                setEditFormId('-1');
                setOpenForm(true);
              },
              permission: employeeEmployeeLeavePermissionWrite,
              text: '+ Dodaj urlop',
              id: 'employeeLeavesListingAdd',
              color: 'primary',
            },
          ]}
          columns={[
            {
              Header: 'ID',
              accessor: 'id',
              width: 150,
              Cell: BusinessIdColumn,
            },
            {
              Header: 'Od',
              accessor: 'dateFrom',
              Filter: DateFilter(),
              filterMethod: dateFilterMethod,
              Cell: getDateCell('dateFrom'),
            },
            {
              Header: 'Do',
              accessor: 'dateTo',
              Filter: DateFilter(),
              filterMethod: dateFilterMethod,
              Cell: getDateCell('dateTo'),
            },
            {
              Header: 'Typ',
              accessor: 'type',
              Filter: SelectFilter(vacationOptions),
              Cell: mapValueFromOptions(vacationOptions, 'type'),
            },
            {
              Header: 'Akcja',
              filterable: false,
              sortable: false,
              Cell: (rowData) => {
                const { id } = rowData.row._original;
                return (
                  <div className="d-block w-100 text-center row">
                    <ActionColumn
                      data={rowData.row._original}
                      buttons={[
                        {
                          id: 'employeeLeavesEdit',
                          color: 'link',
                          label: 'Edytuj',
                          onClick: () => {
                            setEditFormId(id);
                            setOpenForm(true);
                          },
                        },
                        {
                          id: 'employeeLeavesDelete',
                          color: 'link',
                          label: 'Usuń',
                          permission: employeeEmployeeLeavePermissionWrite,
                          onClick: () => deleteVacation(id),
                        },
                      ]}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </DataLoading>
      {openForm ? <Form close={closeForm} isOpen={Boolean(openForm)} vacationId={editFormId} employeeId={employeeId} /> : null}
    </>
  );
}

VacationsListing.propTypes = {
  employeeId: PropTypes.string.isRequired,
};
