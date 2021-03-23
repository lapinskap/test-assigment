import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect } from 'react';
import Files from './files';
import Form from '../../../../Components/Form';
import { companyAttachmentPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../Components/Popup/popup';
import { getRandomId } from './utils';

export default function AttachmentForm({
  close, attachmentId, setAttachments, attachments,
}) {
  const [data, setData] = useState({});
  const isNew = attachmentId === '-1';
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  useEffect(() => {
    if (isNew) {
      setData({ isNew: true });
    } else {
      setData({ ...attachments.find(({ id }) => id === attachmentId) || {} });
    }
  }, [isNew, attachmentId, attachments]);

  const submit = async () => {
    const updatedAttachment = { ...data, toSave: true };
    if (!updatedAttachment.id) {
      updatedAttachment.id = getRandomId();
      updatedAttachment.tmpId = true;
      setAttachments([...attachments, updatedAttachment]);
    } else {
      const updatedAttachments = [...attachments];
      const originalAttachment = updatedAttachments.find(({ id }) => id === attachmentId);
      if (originalAttachment) {
        updatedAttachments[updatedAttachments.indexOf(originalAttachment)] = updatedAttachment;
        setAttachments(updatedAttachments);
      }
    }
    close();
  };

  return (
    <>
      <Popup id="attachmentPopup" isOpen toggle={() => close()} unmountOnClose>
        <Form
          id="attachmentForm"
          data={data || {}}
          config={{
            isInPopup: true,
            togglePopup: close,
            title: isNew ? 'Dodaj nowy załącznik' : `Edycja załącznika ${attachmentId}`,
            onSubmit: submit,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                permission: companyAttachmentPermissionWrite,
                type: 'submit',
                id: 'attachmentFormSubmit',
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'type',
                    dataOldSk: 'type',
                    label: 'Typ załącznika',
                    type: 'select',
                    validation: ['required'],
                    options: [...types],
                  },
                  {
                    id: 'name',
                    dataOldSk: 'name',
                    label: 'Nazwa dokumentu',
                    type: 'text',
                    validation: ['required'],
                  },
                  {
                    component: <Files key="attachmentFiles" attachment={data} updateAttachment={onChange} />,
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

AttachmentForm.propTypes = {
  attachmentId: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    attachmentsFiles: PropTypes.arrayOf(PropTypes.shape({

    })),
  })),
  setAttachments: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

AttachmentForm.defaultProps = {
  attachments: [],
};

export const types = [
  {
    value: 'regulations',
    label: 'Regulamin',
  },
  {
    value: 'form',
    label: 'Formularz',
  },
  {
    value: 'other',
    label: 'Inne dokumenty',
  },
];
