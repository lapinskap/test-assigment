import { fileToBase64 } from '../../../../../utils/Parsers/fileToBase64';
import { restApiRequest, TOURISM_SERVICE } from '../../../../../utils/Api';

export const uploadImageFromFile = async (file, objectId) => {
  const convertedFile = await fileToBase64(file);
  return restApiRequest(
    TOURISM_SERVICE,
    `/tourism-pictures/${objectId}/file`,
    'POST',
    {
      body: {
        name: file.path,
        file: convertedFile,
      },
    },
    {
      path: '/mockData/tourismObjects/gallery/image.jpg',
      name: 'image.jpg',
    },
  ).then((el) => ({
    ...el,
    tmpId: file.tmpId,
  })).catch((e) => {
    console.error(e);
    return null;
  });
};
export const uploadImageFromUrl = async (url, objectId) => restApiRequest(
  TOURISM_SERVICE,
  `/tourism-pictures/${objectId}/url`,
  'POST',
  {
    body: {
      name: url.split('/').pop(),
      url,
    },
  },
  {
    path: '/mockData/tourismObjects/gallery/image.jpg',
    name: 'image.jpg',
  },
).catch((e) => {
  console.error(e);
  return null;
});
