import React, { useEffect, useState } from 'react';
import SortableTree from 'react-sortable-tree';
import PropTypes from 'prop-types';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

import { Button, Card, CardBody } from 'reactstrap';
import __ from '../../../utils/Translations';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import GroupEditForm from './groupEditForm';
import NewDocumentForm from './newDocumentForm';
import {
  deleteCmsGroup, parseDataToDisplay, parseDocumentsTree, renderTitle,
} from './util';
import { cmsDocumentPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import RbsButton from '../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';

export default function DocsTree({
  changeCms, refreshDocumentsTree, documentsTree, cmsCode, isDefaultScope,
}) {
  const [searchString] = useState('');
  const [editGroup, setEditGroup] = useState(false);
  const [newDocumentGroupId, setNewDocumentGroupId] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);

  const updateTreeData = (newTreeData) => {
    setTreeData([...newTreeData]);
  };

  const deleteGroup = async (nodeId) => {
    try {
      setTreeData(treeData.filter(({ id }) => id !== nodeId));
      await deleteCmsGroup(nodeId);
      dynamicNotification(__('Pomyślnie usunięto grupę'));
    } catch (e) {
      dynamicNotification(e.message || __('Nie udało się usunąć grupy dokumentów'), 'error');
      refreshDocumentsTree();
    }
  };

  const expandAll = () => {
    setExpandedGroups(
      treeData.map(({ id }) => id),
    );
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

  const closeGroupEditPopup = (refreshTree = false) => {
    setEditGroup(null);
    if (refreshTree) {
      refreshDocumentsTree();
    }
  };

  const closeNewDocumentForm = (newDocumentCode = false) => {
    setNewDocumentGroupId(null);
    if (newDocumentCode) {
      refreshDocumentsTree();
      changeCms(newDocumentCode);
    }
  };

  useEffect(() => {
    const groupToOpen = documentsTree.find((group) => group.documents && group.documents.find(({ code }) => code === cmsCode));
    if (groupToOpen) {
      const groupId = groupToOpen.id;
      expandGroup(groupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsCode, documentsTree]);

  useEffect(() => {
    setTreeData(parseDocumentsTree(documentsTree));
  }, [setTreeData, documentsTree]);

  return (
    <Card className="col docs-tree-column">
      <CardBody>
        <div className="docs-tree-button">
          <div className="p-3">
            <Button color="secondary" size="sm" onClick={expandAll} data-t1="expandAll">
              Rozwiń wszystko
            </Button>
            {' '}
            <Button color="secondary" size="sm" onClick={collapseAll} data-t1="collapseAll">
              Zwiń wszystko
            </Button>
          </div>

          <div className="h-100" data-t1="cmsGroupTree">
            <SortableTree
              theme={FileExplorerTheme}
              treeData={parseDataToDisplay(treeData, isDefaultScope, true, expandedGroups)}
              onChange={updateTreeData}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              searchFinishCallback={(matches) => {
                setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
              }}
              onMoveNode={async ({
                node, nextParentNode,
              }) => {
                try {
                  expandGroup(nextParentNode.id);
                  await restApiRequest(
                    CMS_SERVICE,
                    '/change-document-group',
                    'PATCH',
                    {
                      body: {
                        code: node.code,
                        groupId: nextParentNode.id,
                      },
                    },
                  );
                } catch (e) {
                  dynamicNotification(e.message || __('Nie udało się zmienić grupy dla dokumentu'), 'error');
                  refreshDocumentsTree();
                }
              }}
              canDrag={isDefaultScope ? ({ node }) => !node.dragDisabled && !node.addBranch && !node.isDirectory : false}
              canDrop={({ nextParent, prevParent }) => (nextParent && nextParent.isDirectory && (nextParent.id !== prevParent.id))}
              onVisibilityToggle={({ node, expanded }) => {
                if (expanded) {
                  expandGroup(node.id);
                } else {
                  collapseGroup(node.id);
                }
              }}
              canNodeHaveChildren={({ isDirectory }) => isDirectory}
              generateNodeProps={({ node }) => {
                const buttons = [];
                const icons = [];
                const style = {};
                const { isDirectory, addBranch, parentId } = node;
                const hasDocs = isDirectory && node.children.length > 1;
                const isSelectedDocument = !node.isDirectory && node.code === cmsCode;

                if (isDirectory) {
                  icons.push(<div
                    style={{
                      borderLeft: 'solid 8px gray',
                      borderBottom: 'solid 10px gray',
                      marginRight: 10,
                      boxSizing: 'border-box',
                      width: 16,
                      height: 12,
                      filter: node.expanded
                        ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                        : 'none',
                      borderColor: node.expanded ? 'white' : 'gray',
                    }}
                  />);
                }

                if (addBranch) {
                  buttons.push(
                    <RbsButton
                      data-t1="addGroup"
                      permission={cmsDocumentPermissionWrite}
                      className="btn-icon btn-icon-only btn-pill p-1 text-secondary"
                      color="link"
                      title="Dodaj"
                      onClick={() => {
                        if (isDirectory) {
                          setEditGroup(-1);
                        } else if (parentId) {
                          setNewDocumentGroupId(parentId);
                        }
                      }}
                    >
                      <i className="lnr-plus-circle btn-icon-wrapper"> </i>
                    </RbsButton>,
                  );
                } else if (!isSelectedDocument && (isDefaultScope || !isDirectory)) {
                  buttons.push(
                    <Button
                      data-t1="editGroup"
                      className="btn-icon btn-icon-only btn-pill p-1 text-secondary"
                      color="link"
                      title="Edytuj"
                      onClick={() => {
                        if (node.isDirectory) {
                          setEditGroup(node.id);
                        } else {
                          changeCms(node.code);
                        }
                      }}
                    >
                      <i className="lnr-pencil btn-icon-wrapper"> </i>
                    </Button>,
                  );
                }
                if (isDirectory && !hasDocs && !addBranch && isDefaultScope) {
                  buttons.push(
                    <RbsButton
                      data-t1="deleteGroup"
                      permission={cmsDocumentPermissionWrite}
                      className="btn-icon btn-icon-only btn-pill p-1 text-secondary"
                      color="link"
                      title="Usuń"
                      onClick={() => {
                        deleteGroup(node.id);
                      }}
                    >
                      <i className="lnr-trash btn-icon-wrapper"> </i>
                    </RbsButton>,
                  );
                }

                if (isSelectedDocument) {
                  style.color = '#545cd8';
                  style.margin = '3px 0';
                }
                return {
                  style,
                  buttons,
                  icons,
                  title: renderTitle,
                };
              }}
            />
          </div>
        </div>
        {editGroup ? (
          <GroupEditForm
            close={closeGroupEditPopup}
            groupId={editGroup}
            groupName={editGroup === -1 ? '' : treeData.find(({ id }) => id === editGroup).title}
          />
        ) : null}
        {newDocumentGroupId ? (
          <NewDocumentForm
            close={closeNewDocumentForm}
            groupId={newDocumentGroupId}
          />
        ) : null}
      </CardBody>
    </Card>
  );
}

DocsTree.propTypes = {
  cmsCode: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  documentsTree: PropTypes.array.isRequired,
  isDefaultScope: PropTypes.bool.isRequired,
  refreshDocumentsTree: PropTypes.func.isRequired,
  changeCms: PropTypes.func.isRequired,
};
DocsTree.defaultProps = {
  cmsCode: null,
};
