import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';
import { Alert } from 'reactstrap';
import DataTable from '../../../../Components/DataTable';
import Form, { types } from './form';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import __ from '../../../../utils/Translations';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import { SelectFilter } from '../../../../Components/DataTable/filters';
import ActionColumn from '../../../../Components/DataTable/actionColumn';
import {
  catalogProductAttachmentPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { downloadAttachmentFile, getFileName } from './utils';

export default function ProductAttachments({
  productId, setAttachments, attachments, loadingAttachments, hasAccessToReadAttachment,
}) {
  const [editFormAttachmentId, setEditFormAttachmentId] = useState(null);
  const isNew = !productId;
  const deleteAttachment = async (id) => {
    if (isNew) {
      setAttachments(attachments.filter(({ id: attachmentId }) => attachmentId !== id));
    } else {
      const attachment = attachments.find(({ id: attachmentId }) => attachmentId === id);
      if (attachment) {
        if (attachment.tmpId) {
          setAttachments(attachments.filter(({ id: attachmentId }) => attachmentId !== id));
        } else {
          const updatedAttachments = [...attachments];
          updatedAttachments[attachments.indexOf(attachment)] = { ...attachment, toDelete: true };
          setAttachments(updatedAttachments);
        }
      }
    }
  };
  return (
    <>
      <ContentLoading
        show={loadingAttachments}
      >
        <div className="text-right p-2">
          <RbsButton
            data-t1="productAttachmentsListingAdd"
            color="primary"
            permission={catalogProductAttachmentPermissionWrite}
            onClick={() => {
              setEditFormAttachmentId('-1');
            }}
          >
            +
            {__('Dodaj załącznik')}
          </RbsButton>
        </div>
        {productId && hasAccessToReadAttachment ? (
          <Alert color="secondary">{__('Zmiany wprowadzone w tabeli załączników należy potwierdzić zapisaniem całego formularza.')}</Alert>
        ) : null}
        {!hasAccessToReadAttachment ? (
          <Alert color="danger">{__('Nie masz dostępu do podglądu załączników.')}</Alert>
        ) : null}
        <DataTable
          id="companyAttachmentsListing"
          data={attachments?.filter(({ toDelete }) => !toDelete) || []}
          noCards
          filterable
          columns={[
            {
              Header: 'Typ załącznika',
              accessor: 'type',
              Filter: SelectFilter(types, false),
              Cell: mapValueFromOptions(types, 'type'),
            },
            {
              Header: 'Nazwa dokumentu',
              accessor: 'name',
              Filter: (event) => ({ filter, onChange, column }) => {
                if (event.keyCode === 13) {
                  event.stopImmediatePropagation();
                }
                return (
                  <input
                    data-t1="gridFilter"
                    data-t2={column.id}
                    type="text"
                    style={{
                      width: '100%',
                    }}
                    placeholder={column.Placeholder}
                    value={filter ? filter.value : ''}
                    onChange={() => onChange(event.target.value)}
                  />
                );
              },
            },
            {
              Header: 'Pliki',
              accessor: 'attachmentFiles',
              filterable: false,
              Cell: (Row) => {
                const { column, original: data } = Row;
                const value = data[column.id];
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
                                {(fileName && fileName.length > 12) ? `${fileName.slice(0, 15)}...` : fileName}
                                {' '}
                              </span>
                              {' '}
                              <RbsButton
                                data-t1="downloadAttachmentFile"
                                permission={catalogProductAttachmentPermissionWrite}
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

                  </div>
                );
              },
            },
            {
              Header: 'Akcja',
              accessor: 'action',
              filterable: false,
              sortable: false,
              Cell: (rowData) => (
                <div className="d-block w-100 text-center">
                  <ActionColumn
                    data={rowData.row._original}
                    buttons={[
                      {
                        id: 'companyAttachmentsEdit',
                        color: 'link',
                        label: 'Edytuj',
                        onClick: () => setEditFormAttachmentId(rowData.row._original.id),
                      },
                      {
                        id: 'companyAttachmentsDelete',
                        color: 'link',
                        label: 'Usuń',
                        permission: catalogProductAttachmentPermissionWrite,
                        onClick: () => {
                          getUserConfirmationPopup(
                            __('Czy na pewno chcesz usunąć załącznik?'),
                            (confirm) => confirm && deleteAttachment(rowData.row._original.id),
                            __('Usuwanie załącznika'),
                          );
                        },
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </ContentLoading>
      {editFormAttachmentId ? (
        <Form
          close={() => setEditFormAttachmentId(null)}
          attachmentId={editFormAttachmentId}
          attachments={attachments}
          setAttachments={setAttachments}
        />
      ) : null}
    </>
  );
}

ProductAttachments.propTypes = {
  productId: PropTypes.string,
  setAttachments: PropTypes.func.isRequired,
  hasAccessToReadAttachment: PropTypes.bool,
  loadingAttachments: PropTypes.bool.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    attachmentsFiles: PropTypes.arrayOf(PropTypes.shape({

    })),
  })),
};

ProductAttachments.defaultProps = {
  productId: null,
  attachments: [],
  hasAccessToReadAttachment: null,
};
