import { COMPANY_MANAGEMENT_SERVICE, downloadFile } from '../../../../../utils/Api';
// eslint-disable-next-line import/prefer-default-export
import { dynamicNotification } from '../../../../../utils/Notifications';

// eslint-disable-next-line import/prefer-default-export
export const downloadAttachment = (attachmentId, fileName) => downloadFile(
  COMPANY_MANAGEMENT_SERVICE,
  `/attachments/download/${attachmentId}`,
  fileName,
);

export const getRandomId = () => Math.random().toString(36).substr(2, 5);

export const getFileName = ({ contentUrl }) => contentUrl.split('/').pop();

// TODO IMPLEMENT ENDPOINT FROM BACKEND
export const downloadAttachmentFile = (file) => dynamicNotification('Funkcjonalność jeszcze nie dostępna', 'warning');
