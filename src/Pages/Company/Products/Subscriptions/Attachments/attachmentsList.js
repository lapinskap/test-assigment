import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import DataTable from '../../../../../Components/DataTable';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { subscriptionAttachmentPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import {
  ATTACHMENT_IRI_PREFIX,
  ATTACHMENT_TYPE_FORM, EMPLOYEE_GROUP_DEFAULT, getRandomId, MEDIA_OBJECT_IRI_PREFIX,
} from './utils';
import { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefits';
import { getIriFromId } from '../../../../../utils/jsHelpers/iriConverter';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import { filesCell, nameInputCell, typeSelectColumn } from './attachmentsList/fields';
import FilesPopup from './attachmentsList/filesPopup';
import { mapValueFromOptions } from '../../../../../Components/DataTable/commonCells';
import { DEFAULT_SETTING_GROUP } from '../utils/consts';
import BenefitsContext from '../utils/benefitsContext';

export default function AttachmentList({
  setData, data, setIsBenefitRefreshRequired, setHasUnsavedAttachment, benefitId, employeeGroupId, hasUnsavedAttachment,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilesPopup, setShowFilesPopup] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const [activeRowOriginalData, setActiveRowOriginalData] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [employeeGroupsOptions, setEmployeeGroupsOptions] = useState([]);
  const isDisabled = (rowData) => rowData.row._original.id !== activeRowId;
  const addRow = () => {
    const newId = getRandomId();
    data.push({
      type: ATTACHMENT_TYPE_FORM,
      id: newId,
      isNew: true,
      employeeGroup: employeeGroupId || EMPLOYEE_GROUP_DEFAULT,
      benefit: getIriFromId(benefitId, BENEFIT_IRI_PREFIX),
    });
    setActiveRowId(newId);
    setData([...data]);
  };
  const { employeeGroups } = useContext(BenefitsContext);
  useEffect(() => {
    setEmployeeGroupsOptions([{ value: DEFAULT_SETTING_GROUP, label: '' }, ...employeeGroups]);
  }, [employeeGroups]);

  const openFilesPopup = () => setShowFilesPopup(true);

  const updateRow = (rowIndex, value, validate = false) => {
    const newData = [...data];
    newData[rowIndex] = value;
    setData(newData);
    if (validate) {
      setNameError(!value.name);
    }
    setHasUnsavedAttachment(true);
  };

  const submit = async (attachmentData) => {
    try {
      if (!attachmentData.name) {
        setNameError(true);
        return;
      }
      const { id, ...body } = attachmentData;
      const isNew = Boolean(attachmentData.isNew);
      setIsSubmitting(true);
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/attachments' : `/attachments/${id}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...body,
            attachmentFiles: undefined,
          },
        },
        attachmentData,
      );
      const idAfterSave = res.id;
      if (attachmentData?.attachmentFiles?.length > 0) {
        const filesPromises = attachmentData.attachmentFiles.filter((el) => el.toSave || el.toDelete).map((el) => {
          const isNewFile = !el.id;
          const { toSave, toDelete } = el;
          if (toSave) {
            return restApiRequest(
              SUBSCRIPTION_MANAGEMENT_SERVICE,
              isNewFile ? '/attachment-files' : `/attachment-files/${el.id}`,
              isNewFile ? 'POST' : 'PATCH',
              {
                body: {
                  ...el,
                  file: getIriFromId(el.file.id, MEDIA_OBJECT_IRI_PREFIX),
                  attachment: getIriFromId(idAfterSave, ATTACHMENT_IRI_PREFIX),
                },
              },
            );
          }
          if (toDelete && !isNewFile) {
            restApiRequest(
              SUBSCRIPTION_MANAGEMENT_SERVICE,
              `/attachment-files/${el.id}`,
              'DELETE',
              {
                returnNull: true,
              },
            );
          }
          return null;
        });
        await Promise.all(filesPromises).catch((e) => {
          console.error(e);
          dynamicNotification(e.message || __('Nie wszystkie pliki załącznika zostały zapisane poprawnie'), 'error');
        });
      }

      const updatedAttachmentsList = [...data];
      updatedAttachmentsList[data.indexOf(attachmentData)] = {
        ...res,
        attachmentFiles: attachmentData?.attachmentFiles?.filter(({ toDelete }) => !toDelete)
            .map(({ toSave, ...attachmentFile }) => ({ ...attachmentFile })),
        isNew: false,
      };
      setData(updatedAttachmentsList);
      dynamicNotification(__('Pomyślnie zapisano załącznik'));
      setHasUnsavedAttachment(false);
      setIsBenefitRefreshRequired(true);
      setActiveRowId(null);
      setActiveRowOriginalData(null);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać załącznika'), 'error');
    }
    setIsSubmitting(false);
  };

  const deleteAttachment = async (attachment) => {
    const attachmentsToRestore = [...data];
    try {
      setActiveRowId(null);
      setActiveRowOriginalData(null);
      setNameError(false);
      setData(data.filter(({ id }) => id !== attachment.id));
      if (!attachment.isNew) {
        await restApiRequest(
          SUBSCRIPTION_MANAGEMENT_SERVICE,
          `/attachments/${attachment.id}`,
          'DELETE',
          {
            returnNull: true,
          },
          null,
        );
        setIsBenefitRefreshRequired(true);
      }
      dynamicNotification(__('Pomyślnie zapisano załącznik'));
      setHasUnsavedAttachment(false);
    } catch (e) {
      setData(attachmentsToRestore);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć załącznika'), 'error');
    }
  };
  return (
    <>
      <DataTable
        data={data}
        filterable={false}
        showPagination={false}
        buttons={[
          {
            onClick: addRow,
            text: '+ Dodaj załącznik',
            color: 'primary',
            disabled: isSubmitting,
          },
        ]}
        id="subscriptionsListing"
        key={data.length}
        noCards
        columns={[
          {
            Header: 'Typ załącznika',
            accessor: 'type',
            Cell: typeSelectColumn(updateRow, activeRowId),
          },
          {
            Header: 'Nazwa dokumentu',
            accessor: 'name',
            Cell: nameInputCell(updateRow, activeRowId, nameError),
          },
          !employeeGroupId ? {
            Header: 'Grupa pracownicza',
            accessor: 'employeeGroup',
            Cell: mapValueFromOptions(employeeGroupsOptions, 'employeeGroup'),
            maxWidth: 200,
          } : null,
          {
            Header: 'Plik',
            accessor: 'attachmentFiles',
            Cell: filesCell(updateRow, activeRowId, openFilesPopup),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            Cell: (rowData) => (
              <div className="d-block w-100 text-center">
                {
                    !isDisabled(rowData) ? (
                      <>
                        {
                          hasUnsavedAttachment ? <Alert color="danger">{__('Załącznik posiada niezapisane zmiany')}</Alert> : null
                        }
                        <div>
                          <RbsButton
                            data-t1="removeAttachment"
                            disabled={Boolean(isSubmitting)}
                            color="link"
                            onClick={() => getUserConfirmationPopup(
                              __('Czy na pewno chcesz usunąć ten załącznik?'),
                              (confirm) => confirm && deleteAttachment(rowData.row._original),
                              __('Usuwanie załącznika'),
                            )}
                          >
                            Usuń
                          </RbsButton>
                          <RbsButton
                            data-t1="saveAttachment"
                            disabled={Boolean(isSubmitting)}
                            permission={subscriptionAttachmentPermissionWrite}
                            color="link"
                            onClick={() => submit(rowData.row._original)}
                          >
                            Zapisz
                          </RbsButton>
                          {rowData.row._original.isNew ? null : (
                            <RbsButton
                              data-t1="cancelEditAttachment"
                              color="link"
                              disabled={Boolean(isSubmitting)}
                              onClick={() => {
                                updateRow(rowData.index, activeRowOriginalData);
                                setActiveRowId(null);
                                setActiveRowOriginalData(null);
                                setNameError(false);
                                setHasUnsavedAttachment(false);
                              }}
                            >
                              Anuluj
                            </RbsButton>
                          ) }
                        </div>
                      </>
                    ) : (
                      <RbsButton
                        data-t1="editAttachment"
                        permission={subscriptionAttachmentPermissionWrite}
                        color="link"
                        disabled={Boolean(isSubmitting || activeRowId)}
                        onClick={() => {
                          setActiveRowId(rowData.row._original.id);
                          setActiveRowOriginalData({ ...rowData.row._original });
                        }}
                      >
                        Edytuj
                      </RbsButton>
                    )
                  }
              </div>
            ),
          },
        ].filter(Boolean)}
      />
      {showFilesPopup ? (
        <FilesPopup
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

AttachmentList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setData: PropTypes.func.isRequired,
  benefitId: PropTypes.string.isRequired,
  employeeGroupId: PropTypes.string,
  hasUnsavedAttachment: PropTypes.bool.isRequired,
  setIsBenefitRefreshRequired: PropTypes.func.isRequired,
  setHasUnsavedAttachment: PropTypes.func.isRequired,
};
AttachmentList.defaultProps = {
  employeeGroupId: null,
};
