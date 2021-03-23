import PropTypes from 'prop-types';
import React, {
  useState, useEffect,
} from 'react';
import DataTable from '../../../../../Components/DataTable';
import IpForm from './form';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import ToggleSwitch from '../../../../../Components/FormElements/ToggleSwitch';
import { SSO_SERVICE, restApiRequest } from '../../../../../utils/Api';
import __ from '../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../utils/Notifications';
import { booleanOptions, SelectFilter } from '../../../../../Components/DataTable/filters';
import { useCompanyName } from '../../../CompanyContext';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import {
  ssoIpAddressRestrictionPermissionRead,
  ssoIpAddressRestrictionPermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { ExportContext } from '../../../../../Components/DataTableControlled/exportButton';

export default function IpAdministration({ active, changePageTitleData, companyId }) {
  const companyName = useCompanyName();
  const [data, setData] = useState(null);
  const [editFormId, setEditFormId] = useState('');
  const closeForm = (reload = false) => {
    setEditFormId(0);
    if (reload) {
      setData(null);
    }
  };
  useEffect(() => {
    if (active) {
      changePageTitleData(`IP administratorów firmy ${companyName} (ID: ${companyId})`, [], 'IP administratorów');
    }
  }, [active, changePageTitleData, companyName, companyId]);

  const updateIpVerification = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        setData(updatedData);
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
        setData(updatedData);
      }
      dynamicNotification(e.message || __('Nie udało się zaktualizować adresu IP'), 'error');
    }
  };

  const deleteIp = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        SSO_SERVICE,
        `/ip-address-restrictions/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto adres IP'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć adresu IP'), 'error');
    }
  };

  const exportContext = new ExportContext(
    {
      service: SSO_SERVICE,
      path: '/ip-address-restrictions/export/simple',
      permission: ssoIpAddressRestrictionPermissionRead,
      fileName: `ip_address_restrictions(${companyName})`,
      handleAdditionalFilters: () => [
        {
          id: 'companyId',
          value: companyId,
        },
      ],
    },
  );

  const columns = [
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
      Header: 'Aktywny',
      accessor: 'active',
      Filter: SelectFilter(booleanOptions),
      Cell: (rowData) => (
        <div className="d-block w-100 text-center">
          <ToggleSwitch
            handleChange={(isOn) => {
              updateIpVerification(rowData.row._original.id, isOn);
            }}
            checked={rowData.row._original.active}
          />
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
  return (
    <>
      <DataLoading
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint={`/ip-address-restrictions?companyId=${companyId}&role=ahr&itemsPerPage=10000`}
        mockDataEndpoint="/company/ipRestrictions/list"
        service={SSO_SERVICE}
      >
        <DataTable
          id="companyIpListing"
          columns={columns}
          data={data || []}
          filterable
          exportContext={exportContext}
          rowId="id"
          buttons={[
            {
              onClick: () => {
                setEditFormId('-1');
              },
              text: '+ Dodaj zakres IP',
              color: 'primary',
              permission: ssoIpAddressRestrictionPermissionWrite,
            },
          ]}
        />
      </DataLoading>
      {editFormId ? <IpForm close={closeForm} isOpen={Boolean(editFormId)} ipAddressId={editFormId} companyId={companyId} /> : null}
    </>
  );
}

IpAdministration.propTypes = {
  active: PropTypes.bool,
  changePageTitleData: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  setIsEdited: PropTypes.func,
  companyId: PropTypes.string.isRequired,
};

IpAdministration.defaultProps = {
  active: false,
  setIsEdited: () => {},
};
