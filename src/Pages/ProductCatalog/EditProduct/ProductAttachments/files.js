import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Label,
} from 'reactstrap';
import __ from '../../../../utils/Translations';
import DefaultHashTabBar from '../../../../Components/Tabs/DefaultHashTabBar';
import { useLanguages } from '../../../../utils/Languages/LanguageContext';
import { defaultLanguage } from '../../../../utils/Translations/translationUtils';
import { dynamicNotification } from '../../../../utils/Notifications';
import { CATALOG_MANAGEMENT_SERVICE, uploadFile } from '../../../../utils/Api';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { downloadAttachmentFile, getFileName } from './utils';
import {
  companyAttachmentPermissionRead,
  companyAttachmentPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import FileInput from '../../../../Components/FormElements/FileInput';

export default function Files({
  attachment, updateAttachment,
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
        CATALOG_MANAGEMENT_SERVICE,
        '/media-objects',
        file,
        { accept: 'application/json' },
      );
      const attachmentFiles = attachment?.attachmentFiles ? attachment.attachmentFiles.filter((el) => el.language !== language) : [];
      attachmentFiles.push({
        language,
        file: mediaObject,
      });
      updateAttachment('attachmentFiles', attachmentFiles);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się wgrać pliku'), 'error');
    }
    setIsLoading(false);
  };

  const markAsToDelete = (file) => {
    const attachmentFiles = attachment?.attachmentFiles ? [...attachment.attachmentFiles] : [];
    updateAttachment('attachmentFiles', attachmentFiles.filter((el) => el !== file));
  };

  return (
    <ContentLoading show={isLoading}>
      <div className="rc-tabs rc-tabs-top">
        <DefaultHashTabBar activeKey={language} panels={panels} />
      </div>
      <div>
        {languageFile?.file ? (
          <div>
            {__('Obecny plik')}
            :
            {getFileName(languageFile.file)}
            <RbsButton
              data-t1="deleteAttachmentFile"
              permission={companyAttachmentPermissionWrite}
              onClick={() => markAsToDelete(languageFile)}
              color="link"
            >
              {__('Usuń')}
            </RbsButton>
            <RbsButton
              data-t1="downloadAttachmentFile"
              permission={companyAttachmentPermissionRead}
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
        <div>
          <FileInput onChange={upload} id={`file${language}`} />
        </div>
      </div>
    </ContentLoading>
  );
}

Files.propTypes = {
  updateAttachment: PropTypes.func.isRequired,
  attachment: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    attachmentFiles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};
