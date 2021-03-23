import { dynamicNotification } from '../../../utils/Notifications';

export const getFileName = ({ contentUrl }) => contentUrl.split('/').pop();

// TODO IMPLEMENT ENDPOINT FROM BACKEND
export const downloadFormFieldFile = (file) => dynamicNotification('Funkcjonalność jeszcze nie dostępna', 'warning');
