import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isMockView, restApiRequest, REPORT_SERVICE } from '../../../../utils/Api';
import { companySelectMockData } from '../../NewReport/ReportsList/mockData';
import { dynamicNotification } from '../../../../utils/Notifications';
import CompanySelect from '../../NewReport/ReportsList/companySelect';
import SubscriptionTable from './table';

const SubscriptionList = ({ isAhr }) => {
  const [companySelectList, setCompanySelectList] = useState([]);
  const [selectCompany, setSelectCompany] = useState('-1');

  useEffect(() => {
    fetchCompanySelectData();
  }, []);

  const fetchCompanySelectData = () => {
    fetchData(setCompanySelectList, '/reportgroups/companies', REPORT_SERVICE, 'GET', {}, companySelectMockData, 'Błąd podczas pobierania firm');
  };

  const subscriptionTable = <SubscriptionTable key={selectCompany} isAhr={isAhr} selectCompany={selectCompany} />;

  return (
    <>
      <CompanySelect companies={companySelectList} selectCompany={setSelectCompany} />
      {subscriptionTable}
    </>
  );
};

export default SubscriptionList;
SubscriptionList.propTypes = {
  isAhr: PropTypes.bool.isRequired,
};

const fetchData = async (updateData, endpoint, service, method, { headers, params, body }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params, body }, {});

      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};
