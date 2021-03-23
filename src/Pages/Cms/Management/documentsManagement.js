import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Panel, { HISTORY_TAB_SUFFIX } from './panel';
import DocsTree from './docsTree';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';

const getCmsIdFromHash = (hash) => {
  if (!hash) {
    return null;
  }
  return hash.replace('#', '').replace(HISTORY_TAB_SUFFIX, '');
};

const changeHash = (hash, history) => {
  history.push({
    hash,
  });
};

export default function DocumentsManagement({ companyId, employeeGroupId }) {
  const [documentsTree, setDocumentsTree] = useState([]);
  const history = useHistory();
  const [cmsCode, setEditCmsCode] = useState(getCmsIdFromHash(history.location.hash));
  useEffect(() => {
    getDocumentsTree(companyId, employeeGroupId)
      .then((res) => {
        setDocumentsTree(res);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać drzewa dokumentów')));
  }, [companyId, employeeGroupId, setDocumentsTree]);

  useEffect(() => history.listen((location) => {
    setEditCmsCode(getCmsIdFromHash(location.hash));
  }), [history]);

  const changeCms = (cmsCodeToEdit) => {
    changeHash(cmsCodeToEdit || '', history);
  };

  useEffect(() => {
    if (!cmsCode) {
      for (let i = 0; i < documentsTree.length; i += 1) {
        if (documentsTree[i].documents.length) {
          changeHash(documentsTree[i].documents[0].code, history);
          break;
        }
      }
    }
  }, [documentsTree, cmsCode, setEditCmsCode, history]);

  const refreshDocumentsTree = useCallback(() => {
    getDocumentsTree(companyId, employeeGroupId)
      .then((res) => setDocumentsTree(res))
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać drzewa dokumentów')));
  }, [companyId, employeeGroupId, setDocumentsTree]);
  return (
    <div className="row ml-0">
      <DocsTree
        isDefaultScope={Boolean(!companyId && !employeeGroupId)}
        cmsCode={cmsCode}
        changeCms={changeCms}
        refreshDocumentsTree={refreshDocumentsTree}
        documentsTree={documentsTree}
      />
      {cmsCode
        ? (
          <Panel
            companyId={companyId}
            employeeGroupId={employeeGroupId}
            key={cmsCode}
            cmsCode={cmsCode}
            refreshDocumentsTree={refreshDocumentsTree}
            documentsTree={documentsTree}
            changeCms={changeCms}
            setDocumentsTree={setDocumentsTree}
          />
        ) : null}
    </div>
  );
}

const getDocumentsTree = async (companyId = null, employeeGroupId = null) => {
  const params = {};
  if (companyId) {
    params.companyId = companyId;
  }
  if (employeeGroupId) {
    params.employeeGroupId = employeeGroupId;
  }

  return restApiRequest(
    CMS_SERVICE,
    '/get-document-tree',
    'GET',
    {
      params,
    },
    mockTreeData,
  );
};

const mockTreeData = [
  {
    id: 991,
    name: 'Group 1',
    documents: [
      {
        id: '4b0cef9c-226f-4c12-b318-56e8c5f87f58',
        code: 'test_4',
        title: 'Document 4',
      },
      {
        id: '1b0cef9c-226f-4c12-b318-56e8c5f87f58',
        code: 'test234',
        title: 'Document 1',
      },
      {
        id: '89b6f229-6326-4c4f-a6ea-f617f4142418',
        code: 'new_document',
        title: 'Test',
      },
      {
        id: '3b0cef9c-226f-4c12-b318-56e8c5f87f58',
        code: 'test_36',
        title: 'Document 3 teststsdasdas',
      },
    ],
  },
  {
    id: 992,
    name: 'Group 2',
    documents: [
      {
        id: '2b0cef9c-226f-4c12-b318-56e8c5f87f58',
        code: 'test_2',
        title: 'Document 2',
      },
      {
        id: 'c1787ba2-ddd5-4c6c-8f05-d68b7df2f84a',
        code: 'test_44',
        title: 'nowy, test',
      },
    ],
  },
];

DocumentsManagement.propTypes = {
  companyId: PropTypes.string,
  employeeGroupId: PropTypes.string,
};

DocumentsManagement.defaultProps = {
  companyId: null,
  employeeGroupId: null,
};
