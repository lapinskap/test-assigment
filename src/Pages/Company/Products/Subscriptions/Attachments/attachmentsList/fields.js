import {
  Input, InputGroup, InputGroupAddon, InputGroupText,
} from 'reactstrap';
import React from 'react';
import DynamicTranslationTrigger from '../../../../../../Components/DynamicTranslation/DynamicTranslationTrigger';
import { downloadAttachmentFile, getFileName, typeOptions } from '../utils';
import RbsButton from '../../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import __ from '../../../../../../utils/Translations';
import {
  subscriptionAttachmentFilePermissionRead,
  subscriptionAttachmentFilePermissionWrite,
} from '../../../../../../utils/RoleBasedSecurity/permissions';

export const nameInputCell = (updateRow, activeRowId, error) => ({ column, original: data, index }) => {
  const value = data[column.id];
  const isActiveRow = data.id === activeRowId;
  return (
    <div className="d-block w-100 text-center">
      <InputGroup>
        <Input
          defaultValue={value}
          type="text"
          disabled={!isActiveRow}
          onBlur={(e) => {
            const newValue = e.target.value;
            const updatedRow = { ...data };
            updatedRow[column.id] = newValue;
            updateRow(index, updatedRow);
          }}
          invalid={isActiveRow && error}
        />
        {!data.isNew && value ? (
          <InputGroupAddon addonType="append">
            <InputGroupText>
              <DynamicTranslationTrigger
                scope="company-products_subscriptions_attachment_name"
                value={value}
              />
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </div>
  );
};

export const typeSelectColumn = (updateRow, activeRowId) => ({ column, original: data, index }) => {
  const currentValue = data[column.id] || '';
  const currentId = data.id;
  return (
    <select
      disabled={data.id !== activeRowId}
      value={currentValue}
      id={column.id}
      className="form-control"
      name={column.id}
      onChange={(e) => {
        const newValue = e.target.value;
        const updatedRow = { ...data };
        updatedRow[column.id] = newValue;
        updateRow(index, updatedRow, true);
      }}
    >
      {typeOptions.map(({ value, label }) => (value !== currentId ? <option key={value} value={value}>{label}</option> : null))}
    </select>
  );
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
                  onClick={() => downloadAttachmentFile(file)}
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
