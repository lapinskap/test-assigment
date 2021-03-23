import React, { useState } from 'react';

import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import Form from './form';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import { DateFilter, dateFilterMethod } from '../../../../Components/DataTable/filters';
import { getDateCell } from '../../../../Components/DataTable/commonCells';
import __ from '../../../../utils/Translations';
import ActionColumn from '../../../../Components/DataTable/actionColumn';
import { companyTokenPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function TokenListing({ companyId }) {
  const [data, setData] = useState(null);
  const [tokenId, setEditTokenId] = useState(false);

  const closeForm = (reload = false) => {
    setEditTokenId(0);
    if (reload) {
      setData(null);
    }
  };

  const deleteToken = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/tokens/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto token'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć tokena'), 'error');
    }
  };

  return (
    <>
      <DataLoading
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint={`/tokens?companyId=${companyId}&itemsPerPage=10000`}
        service={COMPANY_MANAGEMENT_SERVICE}
        mockDataEndpoint="/company/tokens/list"
      >
        <DataTable
          id="tokensListing"
          data={data || []}
          filterable
          buttons={[
            {
              onClick: () => {
                setEditTokenId('-1');
              },
              permission: companyTokenPermissionWrite,
              text: '+ Generuj',
            },
          ]}
          columns={[
            {
              Header: 'Nazwa tokena',
              accessor: 'name',
            },
            {
              Header: 'Adres IP',
              accessor: 'ipAddress',
            },
            {
              Header: 'Data ważności tokena',
              accessor: 'expirationDate',
              Filter: DateFilter(),
              filterMethod: dateFilterMethod,
              Cell: getDateCell('expirationDate', true),
            },
            {
              Header: 'Token',
              accessor: 'token',
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => {
                const { id } = rowData.row._original;
                return (
                  <div className="d-block w-100 text-center">
                    <ActionColumn
                      data={rowData.row._original}
                      buttons={[
                        {
                          id: 'tokensListingEdit',
                          className: 'm-1',
                          color: 'link',
                          label: 'Edytuj',
                          onClick: () => setEditTokenId(id),
                        },
                        {
                          id: 'tokensListingDelete',
                          className: 'm-1',
                          color: 'link',
                          label: 'Usuń',
                          permission: companyTokenPermissionWrite,
                          onClick: () => {
                            getUserConfirmationPopup(
                              __('Czy na pewno chcesz usunąć token?'),
                              (confirm) => confirm && deleteToken(id),
                              __('Usuwanie tokena'),
                            );
                          },
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
      {tokenId ? <Form close={closeForm} isOpen={Boolean(tokenId)} companyId={companyId} tokenId={tokenId} /> : null}
    </>
  );
}

TokenListing.propTypes = {
  companyId: PropTypes.string.isRequired,
};
