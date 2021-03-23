/* eslint-disable react/jsx-closing-tag-location */
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { restApiRequest, SSO_SERVICE } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import Form from '../../../../Components/Form';
import { LAYOUT_TWO_COLUMNS } from '../../../../Components/Layouts';
import { ssoIpAddressRestrictionPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../Components/Popup/popup';

export default function IpForm({
  close, isOpen, ipAddressId,
}) {
  const [data, updateData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      await restApiRequest(
        SSO_SERVICE,
        '/ip-address-restrictions?role=omb',
        'POST',
        {
          body: {
            startIpAddress: data.startIpAddress,
            endIpAddress: data.endIpAddress,
            description: data.description,
            active: true,
            role: 'omb',
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano adres IP'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać adresu IP'), 'error');
    }
  };
  return (
    <Popup id="ipRestrictionsPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
      <Form
        id="ipRestrictionsForm"
        data={data}
        config={
          {
            isInPopup: true,
            togglePopup: close,
            title: ipAddressId === '-1' ? 'Dodaj nowy zakres IP' : `Edycja zakresu IP ${ipAddressId}`,
            onSubmit: submit,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'IpSecuritySubmit',
                permission: ssoIpAddressRestrictionPermissionWrite,
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    layout: LAYOUT_TWO_COLUMNS,
                    formElements: [
                      {
                        type: 'ipv4',
                        id: 'startIpAddress',
                        label: 'Początkowy adres IP',
                        placeholder: '000.000.000.000',
                        validation: ['required', 'ipv4'],
                      },
                      {
                        type: 'ipv4',
                        id: 'endIpAddress',
                        label: 'Końcowy adres IP',
                        placeholder: '000.000.000.000',
                        validation: ['required', 'ipv4'],
                      },
                    ],
                  },
                  {
                    type: 'text',
                    id: 'description',
                    label: 'Opis',
                    validation: ['required'],
                  },
                  {
                    type: 'boolean',
                    id: 'active',
                    label: 'Weryfikacja IP',
                  },
                ],
              },
            ],
          }
        }
      />
    </Popup>
  );
}

IpForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  ipAddressId: PropTypes.string.isRequired,
};
