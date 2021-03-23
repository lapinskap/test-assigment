import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Button } from 'reactstrap';
import __ from '../../../../../utils/Translations';
import { downloadAttachment, getFileName } from './utils';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import {
  subscriptionAttachmentFilePermissionRead,
  subscriptionAttachmentFilePermissionWrite,
} from '../../../../../utils/RoleBasedSecurity/permissions';

const FilePreview = ({ fileName, attachmentId }) => (
  <FormGroup>
    <Label for={attachmentId}>
      {__('Plik')}
      :
    </Label>
    <div id={attachmentId}>
      {fileName}
      {' '}
      <Button
        color="link"
        onClick={() => downloadAttachment(attachmentId, fileName)}
      >
        {__('Pobierz')}
      </Button>
    </div>

  </FormGroup>
);

export default FilePreview;

FilePreview.propTypes = {
  fileName: PropTypes.string,
  attachmentId: PropTypes.string.isRequired,
};

FilePreview.defaultProps = {
  fileName: '',
};

export const filesCell = (updateRow, activeRowId, openFilesPopup) => ({ column, original: data }) => {
  const isActiveRow = data.id === activeRowId;
  const value = data[column.id]?.filter(({ toDelete }) => !toDelete);
  return (
    <div>
      {!value || value.length <= 0 ? <div>{__('Brak plików')}</div> : (
        <ul>
          {value.map(({ language, file }) => {
            const fileName = getFileName(file);
            return (
              <li key={language}>
                {language}
                :
                {' '}
                <span title={fileName}>
                  {(fileName && fileName.length > 12) ? `${fileName.slice(0, 15)}...` : fileName }
                  {' '}
                </span>
                {' '}
                <RbsButton
                  data-t1="downloadAttachmentFile"
                  permission={subscriptionAttachmentFilePermissionRead}
                  color="link"
                  onClick={() => downloadAttachment(file)}
                >
                  {__('Pobierz')}
                </RbsButton>
              </li>
            );
          })}
        </ul>
      )}

      {isActiveRow ? (
        <RbsButton
          data-t1="selectAttachmentFiles"
          permission={subscriptionAttachmentFilePermissionWrite}
          onClick={openFilesPopup}
        >
          {__('Wybierz pliki')}
        </RbsButton>
      )
        : null}
    </div>
  );
};
