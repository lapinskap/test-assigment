/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { fileToBase64 } from '../../../../../utils/Parsers/fileToBase64';
import { dynamicNotification } from '../../../../../utils/Notifications';
import FilesPopup from './filePopup';
import __ from '../../../../../utils/Translations';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import Form from '../../../../../Components/Form';
import { useLanguages } from '../../../../../utils/Languages/LanguageContext';
import { companyAttachmentPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../../Components/Popup/popup';
import FilePreview from './filePreview';
import { getIriFromId } from '../../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX } from '../../../../../utils/hooks/company/useCompanies';

const allowedExtensions = ['jpeg', 'jpg', 'png', 'pdf'];

export default function AttachmentForm({
  isOpen, close, attachmentId, companyId,
}) {
  const [data, setData] = useState(null);
  const languages = useLanguages(true, true);
  const isNew = attachmentId === -1;
  const [showFilesPopup, setShowFilesPopup] = useState(false);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);

  const openFilesPopup = () => setShowFilesPopup(true);
  const submit = async () => {
    try {
      let fileData = {};
      if (data.file && data.file[0]) {
        fileData = {
          file: await fileToBase64(data.file[0]),
          fileName: data.file[0].name,
          language: data.language,
        };
      }
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        isNew ? '/attachments' : `/attachments/${attachmentId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            company: getIriFromId(companyId, IRI_PREFIX),
            type: data.type,
            language: data.language,
            name: data.name,
            description: data.description,
            ...fileData,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano załącznik'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać załącznika'), 'error');
    }
  };

  return (
    <>
      <Popup id="attachmentPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose>
        <DataLoading
          fetchedData={isNew || data !== null}
          updateData={(updatedData) => setData(updatedData)}
          mockDataEndpoint="/company/attachments/list"
          endpoint={`/attachments/${attachmentId}`}
          service={COMPANY_MANAGEMENT_SERVICE}
          isNew={isNew}
        >
          <Form
            id="attachmentForm"
            data={data || {}}
            config={{
              isInPopup: true,
              togglePopup: close,
              title: attachmentId === -1 ? 'Dodaj nowy załącznik' : `Edycja załącznika ${attachmentId}`,
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
                      id: 'description',
                      dataOldSk: 'document_desc',
                      label: 'Opis dokumentu',
                      type: 'text',
                    },
                    {
                      displayCondition: !isNew,
                      component: <FilePreview key="attachmentPreview" attachmentId={attachmentId} fileName={data?.fileName || ''} />,
                    },
                    {
                      component:
  <RbsButton
    data-t1="selectAttachmentFiles"
    permission={companyAttachmentPermissionWrite}
    onClick={openFilesPopup}
  >
    {__('Wybierz pliki')}
  </RbsButton>,
                    },
                  ],
                },
              ],
            }}
          />
        </DataLoading>
      </Popup>
      {showFilesPopup ? (
        <FilesPopup
          close={() => setShowFilesPopup(null)}
          attachment={data || {}}
          updateAttachment={onChange}
        />
      ) : null}
    </>
  );
}

AttachmentForm.propTypes = {
  attachmentId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  companyId: PropTypes.string.isRequired,
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
