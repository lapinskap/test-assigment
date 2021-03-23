import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
import { notificationAppMessagePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';
import {
  getEmployeesOptionsFetchMethod,
} from '../../../../../../Components/FormElements/Autocomplete/commonFetchMethods';
import { statusOptions } from '../utils';
import { LAYOUT_THREE_COLUMNS } from '../../../../../../Components/Layouts';

export default function PendingBenefitsTable({ companyId, fetchData }) {
  const [data, setData] = useState({});
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  };
  const onRangeChange = (key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    setData(updatedData);
  };

  const submit = () => fetchData(data);
  return (
    <Form
      id="pendingBenefitsFilters"
      data={data}
      config={
                {
                  title: 'Filtry',
                  onSubmit: submit,
                  buttons: [
                    {
                      size: 'lg',
                      color: 'danger',
                      className: 'mr-2',
                      text: 'Resetuj',
                      onClick: (e) => {
                        setData({});
                        if (e.target.form) {
                          const submitButton = e.target.form.querySelector('button[type="submit"]');
                          setTimeout(() => {
                            submitButton.click();
                          }, 10);
                        }
                      },
                      id: 'pendingBenefitsReset',
                      permission: notificationAppMessagePermissionWrite,
                    },
                    {
                      size: 'lg',
                      color: 'success',
                      className: 'mr-2',
                      text: 'Szukaj',
                      type: 'submit',
                      id: 'pendingBenefitsSearch',
                      permission: notificationAppMessagePermissionWrite,
                    },
                  ],
                  defaultOnChange: onChange,
                  formGroups: [
                    {
                      formElements: [
                        {
                          id: 'formId',
                          label: 'Numer formularza:',
                          type: 'text',
                        },
                        {
                          id: 'createdAt',
                          label: 'Data wyboru:',
                          type: 'dateRange',
                          onChange: onRangeChange,
                        },
                        {
                          layout: LAYOUT_THREE_COLUMNS,
                          formElements: [
                            {
                              id: 'employeeId',
                              label: 'Pracownik/Numer FK:',
                              type: 'asyncAutocomplete',
                              fetchOptions: getEmployeesOptionsFetchMethod(data?.employeeId, { companyId }),
                            },
                            {
                              id: 'benefitName',
                              label: 'Nazwa benefitu:',
                              type: 'text',
                            },
                            {
                              id: 'status',
                              label: 'Status:',
                              type: 'select',
                              options: statusOptions,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                }
              }
    />
  );
}

PendingBenefitsTable.propTypes = {
  companyId: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};
