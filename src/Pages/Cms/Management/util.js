import React from 'react';
import __ from '../../../utils/Translations';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';

export const DOCUMENT_IRI = '/api/cms/v1/rest/documents/';

export const parseDocumentsTree = (data) => data.map(({ id, name, documents = [] }) => ({
  isDirectory: true,
  title: name,
  id,
  children: documents.map(({ title: docTitle, id: docId, code: docCode }) => ({
    title: `${docTitle} (${docCode})`,
    id: docId,
    code: docCode,
  })),
}));

export const parseDataToDisplay = (data, isDefaultScope, isDirectory, expandedGroups = [], parentId = null) => {
  const result = data.filter((el) => !el.addBranch)
    .map((el) => {
      if (el.children) {
        return {
          ...el,
          parentId,
          expanded: isDirectory && expandedGroups.includes(el.id),
          children: parseDataToDisplay(el.children, isDefaultScope, false, [], el.id),
        };
      }
      return { ...el };
    }).sort((a, b) => ((a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1));
  if (isDefaultScope) {
    result.push({
      id: getRandomId(),
      title: isDirectory ? __('Dodaj grupę') : __('Dodaj CMS'),
      active: false,
      addBranch: true,
      parentId,
      children: [],
      isDirectory,
    });
  }
  return result;
};

export const getRandomId = () => Math.random().toString(36).substr(2, 9);

export const deleteCmsGroup = async (groupId) => {
  await restApiRequest(
    CMS_SERVICE,
    `/cms-groups/${groupId}`,
    'DELETE',
    {
      returnNull: true,
    },
    null,
  );
};

// eslint-disable-next-line react/prop-types
export const renderTitle = ({ node }) => <span title={node.title}>{node.title}</span>;
