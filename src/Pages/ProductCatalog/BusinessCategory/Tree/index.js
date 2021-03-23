import React, { useState, useEffect } from 'react';
import SortableTree from 'react-sortable-tree';

import {
  Button, Card, CardHeader, CardBody,
} from 'reactstrap';
import Form from './form';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import {
  parseDataToDisplay,
  updatePosition,
  getAllIds,
  getCategoriesData, parseToTree, getCategoryStyle, MAX_CATEGORY_LEVELS, CATEGORY_TYPE_PRODUCT,
} from './utils';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { catalogCategoryPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default () => {
  const [parentId, setParentId] = useState(null);
  const [positionForNew, setPositionForNew] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const refreshTree = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategoriesData();
      setTreeData(parseToTree(categoriesData));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się pobrać kategorii'), 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshTree();
  }, []);

  const closeForm = (refresh = false) => {
    setCategoryId(null);
    setParentId(null);
    setPositionForNew(null);
    if (refresh) {
      refreshTree();
    }
  };

  const expandAll = () => {
    setExpandedGroups(getAllIds(treeData));
  };

  const collapseAll = () => {
    setExpandedGroups([]);
  };

  const expandGroup = (groupId) => {
    if (!expandedGroups.includes(groupId)) {
      expandedGroups.push(groupId);
      setExpandedGroups([...expandedGroups]);
    }
  };

  const collapseGroup = (groupId) => {
    setExpandedGroups(expandedGroups.filter((el) => el !== groupId));
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="text-left w-50">
            {__('Drzewo kategorii')}
          </div>
          <div className="text-right w-50">
            <Button
              data-t1="expandAll"
              onClick={expandAll}
              className="btn-wide mr-2 btn-icon btn-icon-right"
            >
              Rozwiń wszystko
            </Button>
            <Button
              data-t1="collapseAll"
              onClick={collapseAll}
              className="btn-wide mr-2 btn-icon btn-icon-right"
            >
              Zwiń wszystko
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <ContentLoading show={loading}>
            {treeData.length ? (
              <div style={{ height: '100vh' }} data-t1="categoryTree">
                <SortableTree
                  treeData={parseDataToDisplay(treeData, expandedGroups)}
                  onChange={(newTreeData) => setTreeData(newTreeData)}
                  getNodeKey={({ treeIndex }) => treeIndex}
                  canDrag={({ node }) => !node.dragDisabled && !node.addBranch}
                  canDrop={({ nextParent, node }) => {
                    if (nextParent && nextParent.level >= MAX_CATEGORY_LEVELS) {
                      return false;
                    }
                    if (nextParent && nextParent.type === CATEGORY_TYPE_PRODUCT) {
                      return false;
                    }
                    if (nextParent && nextParent.addBranch) {
                      return false;
                    }
                    if (node.children && node.children.length > 1 && nextParent) {
                      return false;
                    }
                    return true;
                  }}
                  onVisibilityToggle={({ node, expanded }) => {
                    if (expanded) {
                      expandGroup(node.id);
                    } else {
                      collapseGroup(node.id);
                    }
                  }}
                  onMoveNode={async ({
                    node, nextParentNode, treeData: updatedTree,
                  }) => {
                    try {
                      const nodeId = node ? node.id : null;
                      const nextParentId = nextParentNode ? nextParentNode.id : null;
                      if (nextParentNode) {
                        expandGroup(nextParentNode.id);
                      }
                      if (nodeId) {
                        updatePosition(updatedTree, nextParentId, nodeId);
                      }
                    } catch (e) {
                      dynamicNotification(e.message || __('Nie udało się zmienić kolejności'), 'error');
                      refreshTree();
                    }
                  }}
                  generateNodeProps={(rowInfo) => {
                    const {
                      active, addBranch, id, parentId: nodeParentId, positionToSet, type,
                    } = rowInfo.node;
                    const buttons = [];
                    const style = getCategoryStyle(type);
                    if (!active) {
                      style.opacity = 0.5;
                    }

                    if (addBranch) {
                      buttons.push((
                        <RbsButton
                          data-t1="addCategory"
                          permission={catalogCategoryPermissionWrite}
                          className="btn-icon btn-icon-only btn-pill p-1 text-primary"
                          color="link"
                          title="Dodaj kategorię"
                          onClick={() => {
                            setCategoryId('-1');
                            setParentId(nodeParentId);
                            setPositionForNew(positionToSet);
                          }}
                        >
                          <i className="lnr-plus-circle btn-icon-wrapper"> </i>
                        </RbsButton>
                      ));
                    } else {
                      buttons.push((
                        <RbsButton
                          permission={catalogCategoryPermissionWrite}
                          data-t1="editCategory"
                          className="btn-icon btn-icon-only btn-pill p-1 text-secondary"
                          color="link"
                          title="Edytuj"
                          onClick={() => {
                            setCategoryId(id);
                            setParentId(nodeParentId);
                          }}
                        >
                          <i className="lnr-pencil btn-icon-wrapper"> </i>
                        </RbsButton>
                      ));
                    }
                    return { buttons, style };
                  }}
                />
              </div>
            ) : (
              <div className="listing-btn-container">
                <RbsButton
                  data-t1="addCategory"
                  permission={catalogCategoryPermissionWrite}
                  color="primary"
                  className="m-3"
                  onClick={() => {
                    setCategoryId('-1');
                    setParentId(null);
                    setPositionForNew(1);
                  }}
                >
                  +
                  {' '}
                  {__('Dodaj pierwszą kategorię')}
                </RbsButton>
              </div>
            )}
          </ContentLoading>
        </CardBody>
        {categoryId ? (
          <Form
            close={closeForm}
            parentId={parentId}
            categoryId={categoryId}
            position={positionForNew}
          />
        ) : null}
      </Card>
    </>
  );
};
