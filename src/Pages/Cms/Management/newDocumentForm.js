import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { restApiRequest, CMS_SERVICE } from '../../../utils/Api';
import Form from '../../../Components/Form';
import { cmsDocumentPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../Components/Popup/popup';

export default function NewDocumentForm({
  close, groupId,
}) {
  const [data, setData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      await restApiRequest(
        CMS_SERVICE,
        '/default-document',
        'POST',
        {
          body: {
            ...data,
            groupId,
          },
        },
        data,
      );
      close(data.code);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy'), 'error');
    }
  };

  return (
    <>
      <Popup id="newCmsPopup" isOpen toggle={() => close()} unmountOnClose>
        <Form
          id="newCmsForm"
          data={data || {}}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: 'Dodaj CMS',
            onSubmit: submit,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                permission: cmsDocumentPermissionWrite,
                type: 'submit',
                id: 'cmsDocumentSubmit',
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'code',
                    label: 'Kod dokumentu:',
                    type: 'text',
                    validation: ['required'],
                  },
                ],
              },
            ],
          }}
        />
      </Popup>
    </>
  );
}

NewDocumentForm.propTypes = {
  close: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
};
