import {
  CATALOG_MANAGEMENT_SERVICE,
  COMPANY_MANAGEMENT_SERVICE,
  downloadFile,
  restApiRequest,
} from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { getIriFromId } from '../../../../utils/jsHelpers/iriConverter';

export const downloadAttachment = (attachmentId, fileName) => downloadFile(
  COMPANY_MANAGEMENT_SERVICE,
  `/attachments/download/${attachmentId}`,
  fileName,
);

export const getRandomId = () => Math.random().toString(36).substr(2, 5);

export const getFileName = ({ contentUrl }) => contentUrl.split('/').pop();

// TODO IMPLEMENT ENDPOINT FROM BACKEND
export const downloadAttachmentFile = (file) => dynamicNotification('Funkcjonalność jeszcze nie dostępna', 'warning');

export const attachmentTypeOptions = [
  { value: 'form', label: 'Formularz' },
  { value: 'regulations', label: 'Regulamin' },
  { value: 'other', label: 'inne' },
];

export const saveAttachments = async (attachments, productId) => {
  try {
    const promises = [];
    Array.isArray(attachments) && attachments.forEach((attachment) => {
      if (attachment.toDelete) {
        promises.push(new Promise((resolve) => restApiRequest(
          CATALOG_MANAGEMENT_SERVICE,
          `/attachments/${attachment.id}`,
          'DELETE',
          { returnNull: true },
        ).then(() => {
          resolve(null);
        }).catch(() => resolve('delete'))));
      } else if (attachment.toSave) {
        const body = {
          ...attachment,
          attachmentFiles: attachment.attachmentFiles?.map((attachmentFile) => (
            attachmentFile.id ? getIriFromId(attachmentFile.id, '/api/catalog-management/v1/rest/attachment-files') : {
              ...attachmentFile,
              file: getIriFromId(attachmentFile.file.id, '/api/catalog-management/v1/rest/media-objects'),
            })) || [],
          product: productId,
          id: undefined,
        };

        promises.push(new Promise((resolve) => {
          if (attachment.isNew) {
            body.id = undefined;
            restApiRequest(CATALOG_MANAGEMENT_SERVICE, '/attachments', 'POST', { body }).then(() => {
              resolve(null);
            }).catch(() => resolve('save'));
          } else {
            restApiRequest(CATALOG_MANAGEMENT_SERVICE, `/attachments/${attachment.id}`, 'PATCH', { body }).then(() => {
              resolve(null);
            }).catch(() => resolve('save'));
          }
        }));
      }
    });
    if (promises.length) {
      const errors = (await Promise.all(promises)).filter(Boolean);
      if (errors.length) {
        dynamicNotification(__('Nie udało się zapisać wszystkich załączników'), 'error');
      }
    }
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się zapisać wszystkich załączników'), 'error');
  }
};

export const fetchAttachments = async (productId) => (productId ? restApiRequest(
  CATALOG_MANAGEMENT_SERVICE,
  '/attachments',
  'GET',
  {
    params: {
      product: productId,
    },
  },
  [],
) : []);
