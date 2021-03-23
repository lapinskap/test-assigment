import React, { useState } from 'react';
import IpRestrictions from './IpRestrictions';
import DataLoading from '../../../../Components/Loading/dataLoading';
import DataTable from '../../../../Components/DataTable';
import ToggleSwitch from '../../../../Components/FormElements/ToggleSwitch';
import { restApiRequest, SSO_SERVICE } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import { booleanOptions, SelectFilter } from '../../../../Components/DataTable/filters';
import { dynamicNotification } from '../../../../utils/Notifications';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import SecurityWrapper from '../../../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';
import {
  ssoIpAddressRestrictionPermissionRead,
  ssoIpAddressRestrictionPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { ExportContext } from '../../../../Components/DataTableControlled/exportButton';

export default function IpTable() {
  const [data, updateData] = useState(null);
  const [editFormId, setEditFormId] = useState(null);
  const closeForm = (reload = false) => {
    setEditFormId(0);
    if (reload) {
      updateData(null);
    }
  };

  const updateIpVerification = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        updateData(updatedData);
      }
      await restApiRequest(
        SSO_SERVICE,
        `/ip-address-restrictions/${id}`,
        'PATCH',
        {
          body: {
            active: value,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zaktualizowano adres IP'));
    } catch (e) {
      console.error(e);
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        updateData(updatedData);
      }
      dynamicNotification(e.message || __('Nie udało się zaktualizować adresu IP'), 'error');
    }
  };

  const deleteIp = async (id) => {
    try {
      updateData(data.filter((el) => el.id !== id));
      await restApiRequest(
        SSO_SERVICE,
        `/ip-address-restrictions/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto adres IP'));
    } catch (e) {
      updateData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć adresu IP'), 'error');
    }
  };

  return (
    <>
      <DataLoading
        fetchedData={data !== null}
        updateData={(updatedData) => updateData(updatedData)}
        endpoint="/ip-address-restrictions?role=omb&itemsPerPage=10000"
        mockDataEndpoint="/company/ipRestrictions/list"
        service={SSO_SERVICE}
      >
        <DataTable
          id="ipSecurityListing"
          columns={columns(updateIpVerification, deleteIp)}
          data={data || []}
          exportContext={exportContext}
          noCards
          // massActions={[
          //   {
          //     permission: ssoIpAddressRestrictionPermissionWrite,
          //     label: 'Usuń',
          //     id: 'delete',
          //     action: (count) => {
          //       const callback = () => null;
          //       getUserConfirmationPopup(__(`Czy na pewno chcesz usunąć zaznaczone elementy? (ilość: ${count})`,
          // [count]), callback, 'Potwierdzenie');
          //     },
          //   },
          // ]}
          filterable
          rowId="id"
          buttons={[
            {
              onClick: () => {
                setEditFormId('-1');
              },
              id: 'ipSecurityAddIP',
              permission: ssoIpAddressRestrictionPermissionWrite,
              text: '+ Dodaj zakres IP',
              color: 'primary',
            },
          ]}
        />
      </DataLoading>

      { editFormId ? <IpRestrictions close={closeForm} isOpen={editFormId} ipAddressId={editFormId} /> : null }
    </>
  );
}

const columns = (updateIpVerification, deleteIp) => [
  {
    Header: 'Opis',
    accessor: 'description',
  },
  {
    Header: 'Początkowy adres IP',
    accessor: 'startIpAddress',
  },
  {
    Header: 'Końcowy adres IP',
    accessor: 'endIpAddress',
  },
  {
    Header: 'Weryfikacja IP ',
    accessor: 'active',
    Filter: SelectFilter(booleanOptions),
    Cell: (rowData) => (
      <div className="d-block w-100 text-center">
        <SecurityWrapper permission={ssoIpAddressRestrictionPermissionWrite} disable>
          <ToggleSwitch
            handleChange={(isOn) => {
              updateIpVerification(rowData.row._original.id, isOn);
            }}
            checked={rowData.row._original.active}
          />
        </SecurityWrapper>
      </div>
    ),
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (rowData) => (
      <div className="d-block w-100 text-center">
        <RbsButton
          permission={ssoIpAddressRestrictionPermissionWrite}
          color="link"
          onClick={() => {
            getUserConfirmationPopup(
              __('Czy na pewno chcesz usunąć adres IP?'),
              (confirm) => confirm && deleteIp(rowData.row._original.id, true),
              __('Usuwanie adresu IP'),
            );
          }}
          className="m-1"
        >
          Usuń
        </RbsButton>
      </div>
    ),
  },
];
const exportContext = new ExportContext(
  {
    service: SSO_SERVICE,
    path: '/ip-address-restrictions/export/simple',
    permission: ssoIpAddressRestrictionPermissionRead,
    fileName: 'ip_address_restrictions',
  },
);
