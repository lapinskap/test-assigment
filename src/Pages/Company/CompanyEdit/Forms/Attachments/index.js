/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, {
  useState, useEffect,
} from 'react';
import DataTable from '../../../../../Components/DataTable';
import Form, { types } from './form';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import {
  COMPANY_MANAGEMENT_SERVICE, restApiRequest,
} from '../../../../../utils/Api';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import { SelectFilter } from '../../../../../Components/DataTable/filters';
import { useCompanyName } from '../../../CompanyContext';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';
import { companyAttachmentPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import { filesCell } from './filePreview';
import { downloadAttachment } from './utils';
import FilePopup from './filePopup';

export default function Attachments({ active, changePageTitleData, companyId }) {
  const [data, setData] = useState(null);
  const companyName = useCompanyName();
  const [editFormId, setEditFormId] = useState(0);
  const openFilesPopup = () => setShowFilesPopup(true);
  const [showFilesPopup, setShowFilesPopup] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const [nameError, setNameError] = useState(false);

  const updateRow = (rowIndex, value, validate = false) => {
    const newData = [...data];
    newData[rowIndex] = value;
    setData(newData);
    if (validate) {
      setNameError(!value.name);
    }
  };

  const closeForm = (reload = false) => {
    setEditFormId(0);
    if (reload) {
      setData(null);
    }
  };
  useEffect(() => {
    if (active) {
      changePageTitleData(`Załączniki firmy ${companyName} (ID: ${companyId})`, [], 'Załączniki');
    }
  }, [active, changePageTitleData, companyName, companyId]);

  const deleteAttachment = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/attachments/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto załącznik'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć załącznika'), 'error');
    }
  };

  return (
    <>
      <DataLoading
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        mockDataEndpoint="/company/attachments/list"
        endpoint={`/attachments?companyId=${companyId}&itemsPerPage=10000`}
        service={COMPANY_MANAGEMENT_SERVICE}
      >
        <DataTable
          id="companyAttachmentsListing"
          columns={columns(setEditFormId, deleteAttachment, updateRow, activeRowId, openFilesPopup)}
          data={data || []}
          filterable
          buttons={[
            {
              onClick: () => {
                setEditFormId(-1);
              },
              permission: companyAttachmentPermissionWrite,
              text: '+ Dodaj załącznik',
              id: 'companyAttachmentsListingAdd',
              color: 'primary',
            },
          ]}
        />
      </DataLoading>
      {editFormId ? <Form close={closeForm} isOpen={Boolean(editFormId)} attachmentId={editFormId} companyId={companyId} /> : null}
      {showFilesPopup ? (
        <FilePopup
          close={() => setShowFilesPopup(null)}
          attachment={data.find((el) => el.id === activeRowId)}
          updateAttachment={(attachmentData) => {
            const editedAttachment = data.find((el) => el.id === activeRowId);
            if (editedAttachment) {
              updateRow(data.indexOf(editedAttachment), attachmentData);
            }
          }}
        />
      ) : null}
    </>
  );
}

const columns = (setEditFormId, deleteAttachment, updateRow, activeRowId, openFilesPopup) => [
  {
    Header: 'Typ załącznika',
    accessor: 'type',
    Filter: SelectFilter(types),
    Cell: mapValueFromOptions(types, 'type'),
  },
  {
    Header: 'Nazwa dokumentu',
    accessor: 'name',
  },
  {
    Header: 'Opis dokumentu',
    accessor: 'description',
  },
  {
    Header: 'Plik',
    accessor: 'attachmentFiles',
    filterable: false,
    Cell: filesCell(updateRow, activeRowId, openFilesPopup),
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
              onClick: () => setEditFormId(rowData.row._original.id),
            },
            {
              id: 'companyAttachmentsDelete',
              color: 'link',
              label: 'Usuń',
              permission: companyAttachmentPermissionWrite,
              onClick: () => {
                getUserConfirmationPopup(
                  __('Czy na pewno chcesz usunąć załącznik?'),
                  (confirm) => confirm && deleteAttachment(rowData.row._original.id),
                  __('Usuwanie załącznika'),
                );
              },
            },
            {
              id: 'companyAttachmentsDownload',
              color: 'link',
              label: 'Pobierz',
              onClick: () => downloadAttachment(rowData.row._original.id, rowData.row._original.fileName),
            },
          ]}
        />
      </div>
    ),
  },
];

Attachments.propTypes = {
  active: PropTypes.bool,
  changePageTitleData: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  setIsEdited: PropTypes.func,
};

Attachments.defaultProps = {
  active: false,
  setIsEdited: null,
};
