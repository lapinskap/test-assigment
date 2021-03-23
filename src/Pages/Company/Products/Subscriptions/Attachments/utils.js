// eslint-disable-next-line import/prefer-default-export
import { dynamicNotification } from '../../../../../utils/Notifications';

export const getRandomId = () => Math.random().toString(36).substr(2, 5);

export const getFileName = ({ contentUrl }) => contentUrl.split('/').pop();

export const ATTACHMENT_TYPE_FORM = 'form';
export const ATTACHMENT_TYPE_REGULATIONS = 'regulations';
export const ATTACHMENT_TYPE_OTHER = 'other';
export const EMPLOYEE_GROUP_DEFAULT = 'default';

export const MEDIA_OBJECT_IRI_PREFIX = '/api/subscription-management/v1/rest/media-objects';
export const ATTACHMENT_IRI_PREFIX = '/api/subscription-management/v1/rest/attachments';
export const ATTACHMENT_FILE_IRI_PREFIX = '/api/subscription-management/v1/rest/attachment-files';

export const typeOptions = [
  {
    value: ATTACHMENT_TYPE_FORM,
    label: 'Formularz',
  },
  {
    value: ATTACHMENT_TYPE_REGULATIONS,
    label: 'Regulamin',
  },
  {
    value: ATTACHMENT_TYPE_OTHER,
    label: 'Inne dokumenty',
  },
];

// TODO IMPLEMENT ENDPOINT FROM BACKEND
export const downloadAttachmentFile = (file) => dynamicNotification('Funkcjonalność jeszcze nie dostępna', 'warning');
