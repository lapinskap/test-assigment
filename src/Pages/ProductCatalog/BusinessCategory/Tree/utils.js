import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import mockTreeData from './mockTreeData';

export const CATEGORY_TYPE_PRODUCT = 'product';
export const CATEGORY_TYPE_COLLECTIVE = 'collective';
export const MAX_CATEGORY_LEVELS = 3;

export const getCategoryStyle = (categoryType) => {
  if (categoryType === CATEGORY_TYPE_PRODUCT) {
    return { backgroundColor: '#20c997' };
  }
  return { backgroundColor: '#6c757d' };
};

export const parseDataToDisplay = (data, expandedGroups, parentId = null, level = 1) => {
  const root = level === 1;
  const result = data.filter((el) => !el.addBranch).map((el) => {
    const expanded = expandedGroups.includes(el.id);
    const canHasChildren = el.type !== CATEGORY_TYPE_PRODUCT;
    const { active } = el;
    return {
      ...el,
      active,
      level,
      expanded,
      children: canHasChildren ? parseDataToDisplay(el.children || [], expandedGroups, el.id, level + 1) : [],
    };
  });
  if (level <= MAX_CATEGORY_LEVELS) {
    result.push({
      id: '-1',
      title: root ? 'Dodaj kategorię' : 'Dodaj podkategorię',
      active: false,
      positionToSet: result.length,
      addBranch: true,
      expanded: false,
      parentId,
      children: [],
    });
  }
  return result;
};

export const findAndRemoveFromTree = (treeData, nodeId) => treeData.map(({ id, children = [], ...el }) => {
  if (id === nodeId) {
    return null;
  }
  return {
    id,
    ...el,
    children: findAndRemoveFromTree(children, nodeId),
  };
}).filter(Boolean);

export const getAllIds = (treeData, holder = []) => {
  treeData.forEach(({ id, children }) => {
    holder.push(id);
    getAllIds(children, holder);
  });
  return holder;
};

const getNodePosition = (tree, nodeId) => {
  const filteredTree = tree.filter(({ addBranch }) => !addBranch);
  for (let i = 0; i < filteredTree.length; i += 1) {
    const node = filteredTree[i];
    if (node) {
      if (nodeId === node.id) {
        return i + 1;
      }
      if (node.children) {
        const positionInChildren = getNodePosition(node.children, nodeId);
        if (positionInChildren) {
          return positionInChildren;
        }
      }
    }
  }

  return null;
};

export const updatePosition = (updatedTree, nextParentId, nodeId) => {
  const position = getNodePosition(updatedTree, nodeId) || 1;
  const data = {
    parentId: nextParentId,
    position,
  };
  return restApiRequest(
    CATALOG_MANAGEMENT_SERVICE,
    `/business-categories/${nodeId}`,
    'PATCH',
    {
      body: data,
    },
    data,
  );
};

export const getCategoriesData = async () => restApiRequest(
  CATALOG_MANAGEMENT_SERVICE,
  '/get-structured-business-categories',
  'GET',
  {},
  mockTreeData,
);

export const deleteCategoryObject = async (id) => restApiRequest(
  CATALOG_MANAGEMENT_SERVICE,
  `/business-categories/${id}`,
  'DELETE',
  {
    returnNull: true,
  },
  null,
);

export const parseToTree = (data) => data.map(({ name, subcategories = [], ...restData }) => ({
  ...restData,
  title: name,
  children: parseToTree(subcategories),
})).sort((a, b) => a.position - b.position);
