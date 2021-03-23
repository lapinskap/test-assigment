import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Input,
  Label,
} from 'reactstrap';
import __ from '../../../../utils/Translations';
import DefaultHashTabBar from '../../../../Components/Tabs/DefaultHashTabBar';
import { useLanguages } from '../../../../utils/Languages/LanguageContext';
import { defaultLanguage } from '../../../../utils/Translations/translationUtils';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import { SUBSCRIPTION_MANAGEMENT_SERVICE, uploadFile } from '../../../../utils/Api';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { downloadFormFieldFile, getFileName } from '../utils';
import {
  subscriptionPdfFormFilePermissionWrite,
  subscriptionPdfFormFilePermissionRead,
} from '../../../../utils/RoleBasedSecurity/permissions';

export default function Files({
  pdfForm, updatePdfForm,
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

  const languageFile = pdfForm?.formFiles?.find((el) => el.language === language);

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
        ['pdf'],
      );
      const updatedPdfForm = { ...pdfForm, formFiles: pdfForm.formFiles ? [...pdfForm.formFiles] : [] };
      if (languageFile) {
        updatedPdfForm.formFiles[updatedPdfForm.formFiles.indexOf(languageFile)] = {
          ...languageFile, file: mediaObject, toSave: true, toDelete: false,
        };
      } else {
        updatedPdfForm.formFiles.push({
          language,
          file: mediaObject,
          toSave: true,
          toDelete: false,
        });
      }
      updatePdfForm(updatedPdfForm);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się wgrać pliku'), 'error');
    }
    setIsLoading(false);
  };

  const markAsToDelete = (file) => {
    const updatedPdfForm = { ...pdfForm, formFiles: pdfForm.formFiles ? [...pdfForm.formFiles] : [] };
    updatedPdfForm.formFiles[updatedPdfForm.formFiles.indexOf(file)] = { ...file, toDelete: true, toSave: false };
    updatePdfForm(updatedPdfForm);
  };

  return (
    <ContentLoading show={isLoading}>
      <div className="rc-tabs rc-tabs-top">
        <DefaultHashTabBar activeKey={language} panels={panels} />
      </div>
      <div className="p-3">
        {languageFile?.file && !languageFile?.toDelete ? (
          <div>
            {__('Obecny plik')}
            :
            {' '}
            {getFileName(languageFile.file)}
            <RbsButton
              data-t1="deleteAttachmentFile"
              permission={subscriptionPdfFormFilePermissionWrite}
              onClick={() => markAsToDelete(languageFile)}
              color="link"
            >
              {__('Usuń')}
            </RbsButton>
            <RbsButton
              data-t1="downloadAttachmentFile"
              permission={subscriptionPdfFormFilePermissionRead}
              onClick={() => downloadFormFieldFile(languageFile)}
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
          key={`formFile${language}`}
          data-t1={`formFile${language}`}
          type="file"
          id={`file${language}`}
          name={`file${language}`}
          label="Wybierz plik"
          onChange={upload}
        />
      </div>
    </ContentLoading>
  );
}

Files.propTypes = {
  updatePdfForm: PropTypes.func.isRequired,
  pdfForm: PropTypes.shape({
    formFiles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};
