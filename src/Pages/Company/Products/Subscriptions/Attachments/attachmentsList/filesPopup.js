import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Input,
  ModalHeader,
  Card,
  Label,
  CardBody,
  ModalFooter, Button,
} from 'reactstrap';
import __ from '../../../../../../utils/Translations';
import Popup from '../../../../../../Components/Popup/popup';
import DefaultHashTabBar from '../../../../../../Components/Tabs/DefaultHashTabBar';
import { useLanguages } from '../../../../../../utils/Languages/LanguageContext';
import { defaultLanguage } from '../../../../../../utils/Translations/translationUtils';
import ContentLoading from '../../../../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import { SUBSCRIPTION_MANAGEMENT_SERVICE, uploadFile } from '../../../../../../utils/Api';
import RbsButton from '../../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { downloadAttachmentFile, getFileName } from '../utils';
import {
  subscriptionAttachmentFilePermissionRead,
  subscriptionAttachmentFilePermissionWrite,
} from '../../../../../../utils/RoleBasedSecurity/permissions';

export default function FilesPopup({
  attachment, close, updateAttachment,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(defaultLanguage);
  const languages = useLanguages(true);
  const panels = languages.map((lang) => ({
    key: lang.code,
    onClick: () => setLanguage(lang.code),
    props: {
      tab: lang.label,
    },
  }));

  const languageFile = attachment?.attachmentFiles?.find((el) => el.language === language);

  const upload = async ({ target }) => {
    try {
      const file = target.files[0];
      if (!file) {
        return;
      }
      setIsLoading(true);
      const mediaObject = await uploadFile(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/media-objects',
        file,
        { accept: 'application/json' },
      );
      const updatedAttachment = { ...attachment, attachmentFiles: attachment.attachmentFiles ? [...attachment.attachmentFiles] : [] };
      if (languageFile) {
        updatedAttachment.attachmentFiles[updatedAttachment.attachmentFiles.indexOf(languageFile)] = {
          ...languageFile, file: mediaObject, toSave: true, toDelete: false,
        };
      } else {
        updatedAttachment.attachmentFiles.push({
          language,
          file: mediaObject,
          toSave: true,
          toDelete: false,
        });
      }
      updateAttachment(updatedAttachment);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się wgrać pliku'), 'error');
    }
    setIsLoading(false);
  };

  const markAsToDelete = (file) => {
    const updatedAttachment = { ...attachment, attachmentFiles: attachment.attachmentFiles ? [...attachment.attachmentFiles] : [] };
    updatedAttachment.attachmentFiles[updatedAttachment.attachmentFiles.indexOf(file)] = { ...file, toDelete: true, toSave: false };
    updateAttachment(updatedAttachment);
  };

  return (
    <>
      <Popup id="attachmentFilesPopup" isOpen toggle={() => close()} unmountOnClose size="lg">
        <ContentLoading show={isLoading}>
          <ModalHeader toggle={() => close()}>
            {__('Pliki do załącznika {0}', [attachment.name])}
          </ModalHeader>
          <div className="rc-tabs rc-tabs-top">
            <DefaultHashTabBar activeKey={language} panels={panels} />
          </div>
          <Card>
            <CardBody>
              <div>
                {languageFile?.file && !languageFile?.toDelete ? (
                  <div>
                    {__('Obecny plik')}
                    :
                    {getFileName(languageFile.file)}
                    <RbsButton
                      data-t1="deleteAttachmentFile"
                      permission={subscriptionAttachmentFilePermissionWrite}
                      onClick={() => markAsToDelete(languageFile)}
                      color="link"
                    >
                      {__('Usuń')}
                    </RbsButton>
                    <RbsButton
                      data-t1="downloadAttachmentFile"
                      permission={subscriptionAttachmentFilePermissionRead}
                      onClick={() => downloadAttachmentFile(languageFile)}
                      color="link"
                    >
                      {__('Pobierz')}
                    </RbsButton>
                  </div>
                ) : null}
              </div>
              <div>
                <Label for={`file${language}`}>{__('Wgraj nowy plik:')}</Label>
                <Input
                  key={`attachmentFile${language}`}
                  data-t1={`attachmentFile${language}`}
                  type="file"
                  id={`file${language}`}
                  name={`file${language}`}
                  label="Wybierz plik"
                  onChange={upload}
                />
              </div>
            </CardBody>
          </Card>
        </ContentLoading>
        <ModalFooter>
          <Button color="primary" onClick={() => close()}>
            {__('Zamknij')}
          </Button>
        </ModalFooter>
      </Popup>
    </>
  );
}

FilesPopup.propTypes = {
  close: PropTypes.func.isRequired,
  updateAttachment: PropTypes.func.isRequired,
  attachment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    attachmentFiles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

FilesPopup.defaultProps = {

};
