import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimpleTabs from '../../../Components/Tabs/SimpleTabs';
import EditPanel from './editPanel';
import HistoryTable from './historyTable';
import DataLoading from '../../../Components/Loading/dataLoading';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';

export const HISTORY_TAB_SUFFIX = '[history_listing]';

export default function Panel({
  cmsCode, companyId, employeeGroupId, changeCms, refreshDocumentsTree,
}) {
  const [data, updateData] = useState(null);
  const [defaultDocumentData, setDefaultDocumentData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const history = useHistory();
  const getActiveTab = (hashValue) => {
    const hash = hashValue ? hashValue.replace('#', '') : cmsCode;
    return hash;
  };

  useEffect(() => {
    if (companyId || employeeGroupId) {
      restApiRequest(
        CMS_SERVICE,
        `/get-for-scope?code=${cmsCode}${employeeGroupId ? `&companyId=${companyId}` : ''}`,
        'GET',
        {},
        mockDefaultData,
      ).then((res) => setDefaultDocumentData(res))
        .catch((e) => {
          dynamicNotification(e.message || __('Nie udało się pobrać aktualnie dostępnych opublikowanej wersji.'), 'error');
        });
    }
  }, [setDefaultDocumentData, companyId, employeeGroupId, cmsCode]);

  const activeKey = getActiveTab(history.location.hash);
  const documentId = data ? data.documentId : null;
  return (
    <div className="col">
      <DataLoading
        service={CMS_SERVICE}
        fetchedData={data !== null && !refreshData}
        updateData={(updatedData) => {
          setRefreshData(false);
          const dataToSet = { ...updatedData };
          if (!dataToSet.code) {
            dataToSet.code = cmsCode;
          }
          updateData(dataToSet);
        }}
        endpoint={
            `/document-edit?code=${cmsCode}`
            + `${companyId ? `&companyId=${companyId}` : ''}`
            + `${employeeGroupId ? `&employeeGroupId=${employeeGroupId}` : ''}`
        }
        mockDataEndpoint="/cms/document-edit"
      >
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey={cmsCode}
          tabsConfig={[
            {
              name: 'Edycja',
              key: cmsCode,
              component: <EditPanel
                setRefreshData={setRefreshData}
                data={data || {}}
                defaultDocumentData={defaultDocumentData}
                updateData={updateData}
                companyId={companyId}
                employeeGroupId={employeeGroupId}
                changeCms={changeCms}
                refreshDocumentsTree={refreshDocumentsTree}
              />,
            },
            {
              name: 'Historia wersji',
              disabled: Boolean(!documentId),
              key: `${cmsCode}${HISTORY_TAB_SUFFIX}`,
              component: <HistoryTable
                companyId={companyId}
                employeeGroupId={employeeGroupId}
                documentId={documentId}
                refreshDocumentsTree={refreshDocumentsTree}
                setRefreshData={setRefreshData}
              />,
            },
          ]}
        />
      </DataLoading>
    </div>
  );
}

const mockDefaultData = {
  documentId: '4b0cef9c-226f-4c12-b318-56e8c5f87f58',
  title: 'Random title',
  content: '<h4>Lorem ipsum</h4>',
};

Panel.propTypes = {
  refreshDocumentsTree: PropTypes.func.isRequired,
  changeCms: PropTypes.func.isRequired,
  cmsCode: PropTypes.string.isRequired,
  companyId: PropTypes.string,
  employeeGroupId: PropTypes.string,
};

Panel.defaultProps = {
  companyId: null,
  employeeGroupId: null,
};
