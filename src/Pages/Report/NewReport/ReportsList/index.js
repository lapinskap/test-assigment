import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReportGroup from './reportGroup';
import CompanySelect from './companySelect';
import { reportGroupsMockData, companySelectMockData } from './mockData';
import { isMockView, restApiRequest, REPORT_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import { getAhrUrl } from '../../helpers/ahrHelper';

const ReportsList = ({ isAhr }) => {
  const [companySelectList, setCompanySelectList] = useState([]);
  const [selectCompany, setSelectCompany] = useState('-1');
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    fetchCompanySelectData();
  }, []);

  useEffect(() => {
    fetchGroupsData(selectCompany);
  }, [selectCompany]);

  const fetchCompanySelectData = () => {
    fetchData(setCompanySelectList, '/reportgroups/companies', REPORT_SERVICE, {}, companySelectMockData, 'Błąd podczas pobierania firm');
  };

  const fetchGroupsData = (selectedCompany) => {
    setGroupList([]);
    fetchData(setGroupList,
      `/reportgroups/groups/${selectedCompany}`,
      REPORT_SERVICE,
      {},
      reportGroupsMockData,
      'Błąd podczas pobierania grup raportów');
  };

  const reportGroups = groupList.map((item) => <ReportGroup key={item.reportGroupId} group={item} fetchData={fetchData} companyId={selectCompany} />);

  const urlToAdhock = getAhrUrl('/report/adhoc_reports/', isAhr);
  return (
    <div>
      <div className="row">
        <div className="col-md-8 col-6">
          Lista raportów predefiniowanych w podziale na grupy
        </div>
        <div className="col-md-4 col-6 text-right">
          <Link to={urlToAdhock}><Button className="mx-1" color="success">+ Nowy raport</Button></Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 report-group-title">
          Grupy raportów
        </div>
      </div>
      <CompanySelect companies={companySelectList} selectCompany={setSelectCompany} />
      {reportGroups}
    </div>
  );
};

const fetchData = async (updateData, endpoint, service, { headers, params }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, 'GET', { headers, params }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};

export default ReportsList;
ReportsList.propTypes = {
  isAhr: PropTypes.bool.isRequired,
};
