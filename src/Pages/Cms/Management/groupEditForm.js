import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { restApiRequest, CMS_SERVICE } from '../../../utils/Api';
import Form from '../../../Components/Form';
import { cmsDocumentPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../Components/Popup/popup';

export default function GroupEditForm({
  close, groupId, groupName,
}) {
  const [data, setData] = useState({ name: groupName });
  const isNew = groupId === -1;
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      await restApiRequest(
        CMS_SERVICE,
        isNew ? '/cms-groups' : `/cms-groups/${groupId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano grupę.'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy.'), 'error');
    }
  };

  return (
    <>
      <Popup id="cmsGroupEditPopup" isOpen toggle={() => close()} unmountOnClose>
        <Form
          id="cmsGroupEditForm"
          data={data || {}}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: isNew ? 'Dodaj grupę' : `Edytuj nazwę dla grupy ${groupName}`,
            onSubmit: submit,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                permission: cmsDocumentPermissionWrite,
                type: 'submit',
                id: 'cmsSubmit',
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'name',
                    label: 'Nazwa grupy',
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

GroupEditForm.propTypes = {
  close: PropTypes.func.isRequired,
  groupName: PropTypes.string,
  groupId: PropTypes.number.isRequired,
};

GroupEditForm.defaultProps = {
  groupName: '',
};
