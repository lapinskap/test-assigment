/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import DataTable from '../../../Components/DataTable';
import ActionColumn from '../../../Components/DataTable/actionColumn';
import DataLoading from '../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { getUserConfirmationPopup } from '../../../Components/UserConfirmationPopup';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../utils/Api';
import { subscriptionActiveFormGroupPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

export default function ActiveFormList() {
  const [data, setData] = useState(null);

  const deleteForm = async (idToDelete) => {
    try {
      setData(data.filter(({ id }) => id !== idToDelete));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/active-forms/${idToDelete}`,
        'DELETE',
        {
          returnNull: true,
        },
      );
      dynamicNotification(__('Pomyślnie zapisano formularz aktywny'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć formularza aktywnego'), 'error');
      setData(null);
    }
  };

  return (
    <>
      <DataLoading
        service={SUBSCRIPTION_MANAGEMENT_SERVICE}
        endpoint="/active-forms?itemsPerPage=10000"
        mockDataEndpoint="/active-forms/list"
        fetchedData={data !== null}
        updateData={(res) => setData(res)}
      >
        <DataTable
          id="activeFormsListing"
          data={data || []}
          filterable
          buttons={[
            {
              id: 'addActiveForm',
              href: '/active-forms/-1',
              text: '+ Dodaj formularz',
              permission: subscriptionActiveFormGroupPermissionWrite,
              color: 'primary',
            },
          ]}
          columns={[
            {
              Header: 'Nazwa formularza',
              accessor: 'name',
            },
            {
              Header: 'Opis',
              accessor: 'description',
              Cell: (cellData) => {
                let value = cellData.row._original[cellData.column.id];
                if (value) {
                  value = value.replace(/(<([^>]+)>)/gi, '');
                }
                if (value && value.length > 258) {
                  value = `${value.slice(0, 255)}...`;
                }
                return value;
              },
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">

                  <ActionColumn
                    data={rowData.row._original}
                    buttons={[
                      {
                        id: 'activeFormsEdit',
                        href: `/active-forms/${rowData.row._original.id}`,
                        className: 'm-1',
                        color: 'link',
                        label: 'Edytuj',
                      },
                      {
                        id: 'activeFormsDelete',
                        className: 'm-1',
                        onClick: () => {
                          getUserConfirmationPopup(
                            __('Czy na pewno chcesz usunąć ten formularz?'),
                            (confirm) => confirm && deleteForm(rowData.row._original.id),
                            __('Usuwanie formularza aktywnego'),
                          );
                        },
                        permission: subscriptionActiveFormGroupPermissionWrite,
                        color: 'link',
                        label: 'Usuń',
                      },
                      {
                        id: 'activeFormsPreview',
                        className: 'm-1',
                        color: 'link',
                        onClick: () => dynamicNotification('Funkcjonalność nie gotowa', 'warning'),
                        label: 'Podgląd',
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </DataLoading>
    </>
  );
}
