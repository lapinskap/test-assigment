import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Form from '../../../../../../Components/Form';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { employeeEmployeeLeavePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../../../Components/Popup/popup';

export default function FormPopup({
  isOpen, close, vacationId, employeeId,
}) {
  const [data, setData] = useState(null);
  const isNew = vacationId === '-1';
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    setData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        isNew ? '/employee-leaves' : `/employee-leaves/${vacationId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            employeeId,
            ...data,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano urlop'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać urlopu'), 'error');
    }
  };

  return (
    <>
      <Popup id="employeeLeavePopup" isOpen={isOpen} toggle={() => close()} unmountOnClose>
        <DataLoading
          fetchedData={isNew || data !== null}
          updateData={(updatedData) => setData(updatedData)}
          mockDataEndpoint="/company/attachments/list"
          endpoint={`/employee-leaves/${vacationId}`}
          service={EMPLOYEE_MANAGEMENT_SERVICE}
          isNew={isNew}
        >
          <Form
            id="employeeLeaveForm"
            data={data || {}}
            config={{
              isInPopup: true,
              togglePopup: close,
              title: isNew ? 'Dodaj nowy urlop' : 'Edycja urlopu',
              onSubmit: submit,
              buttons: [
                {
                  size: 'lg',
                  color: 'primary',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'employeeLeaveFormSubmit',
                  permission: employeeEmployeeLeavePermissionWrite,
                },
              ],
              defaultOnChange: onChange,
              formGroups: [
                {
                  formElements: [
                    {
                      id: 'type',
                      label: 'Typ',
                      type: 'select',
                      validation: ['required'],
                      options: vacationOptions,
                    },
                    {
                      id: 'date',
                      label: 'Termin',
                      type: 'dateRange',
                      validation: ['rangeRequiredBoth'],
                      onChange: onRangeChange,
                    },
                  ],
                },
              ],
            }}
          />
        </DataLoading>
      </Popup>
    </>
  );
}

FormPopup.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  vacationId: PropTypes.string.isRequired,
  employeeId: PropTypes.string.isRequired,
};

export const vacationOptions = [
  { value: 'option1', label: 'urlop bezpłatny' },
  { value: 'option2', label: 'urlop macierzyński' },
  { value: 'option3', label: 'urlop wychowawczy' },
  { value: 'option4', label: 'inny' },
];
