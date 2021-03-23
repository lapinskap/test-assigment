import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Form from '../../../../Components/Form';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import DataLoading from '../../../../Components/Loading/dataLoading';
import Popup from '../../../../Components/Popup/popup';
import { companyTokenPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function TokenForm({
  isOpen, close, tokenId, companyId,
}) {
  const [data, setData] = useState(null);
  const isNew = tokenId === '-1';
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        isNew ? '/tokens' : `/tokens/${tokenId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            companyId,
            token: 'edre345r32refg4r3refrsdfsd', // TEMPORARY SOLUTION BECAUSE BACKEND DO NOT WORK
            ...data,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano token'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać tokena'), 'error');
    }
  };
  return (
    <>
      <Popup id="tokenEditPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose>
        <DataLoading
          fetchedData={isNew || data !== null}
          updateData={(updatedData) => setData(updatedData)}
          mockDataEndpoint="/company/tokens/edit"
          endpoint={`/tokens/${tokenId}`}
          service={COMPANY_MANAGEMENT_SERVICE}
          isNew={isNew}
        >
          <Form
            id="tokenEditForm"
            data={data || {}}
            config={{
              isInPopup: true,
              togglePopup: close,
              title: isNew ? 'Generuj token' : 'Edytuj token',
              buttons: [
                {
                  size: 'lg',
                  color: 'primary',
                  permission: companyTokenPermissionWrite,
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'tokenEditFormSubmit',
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  formElements: [
                    {
                      id: 'name',
                      dataOldSk: 'token_name',
                      label: 'Nazwa tokena',
                      type: 'text',
                      validation: ['required'],
                    },
                    {
                      id: 'ipAddress',
                      dataOldSk: 'ip_address',
                      label: 'Adres IP',
                      type: 'ipv4',
                      validation: ['required', 'ipv4'],
                    },
                    {
                      id: 'expirationDate',
                      dataOldSk: 'expiration_date',
                      label: 'Data ważności tokena',
                      type: 'date',
                      validation: ['required'],
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

TokenForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  tokenId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
