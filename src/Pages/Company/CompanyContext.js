import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../utils/Api';
import { mockData } from './CompanyList';
import ApiForbiddenError from '../../utils/Api/ApiForbiddenError';
import ForbiddenErrorPage from '../../utils/ErrorPages/403';

const CompanyContext = React.createContext({
  data: {},
  refresh: () => null,
});

export const CompanyContextWrapper = ({ companyId, children, showError }) => {
  const [data, setData] = useState({ id: companyId });
  const [hasAccess, setHasAccess] = useState(true);
  const fetchCompanyData = useCallback(() => {
    if (companyId) {
      restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/companies/${companyId}`,
        'GET',
        {},
        mockData.find(({ id }) => id === companyId),
      ).then((res) => {
        if (res) {
          setData(res);
        }
      }).catch((e) => {
        if (e instanceof ApiForbiddenError) {
          setHasAccess(false);
        } else {
          console.error(e);
        }
      });
    }
  }, [companyId]);
  useEffect(() => {
    fetchCompanyData();
  }, [companyId, fetchCompanyData]);
  let content = children;
  if (!hasAccess) {
    content = showError ? <ForbiddenErrorPage /> : null;
  }
  return (
    <CompanyContext.Provider value={{
      data,
      refresh: fetchCompanyData,
    }}
    >
      {content}
    </CompanyContext.Provider>
  );
};

CompanyContextWrapper.propTypes = {
  companyId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showError: PropTypes.bool,
};

CompanyContextWrapper.defaultProps = {
  showError: true,
};

export const useCompanyName = () => {
  const { data = {} } = useContext(CompanyContext);
  const { fullName: name = '' } = data;
  return name;
};

export const useCompanyId = () => {
  const { data = {} } = useContext(CompanyContext);
  const { id = '' } = data;
  return id;
};

export const useCompanyHasFunctionality = (code) => {
  const { data = {} } = useContext(CompanyContext);
  const { functionalities = [] } = data;
  return functionalities.includes(code);
};

export const useCompanyValue = (fieldCode, defaultValue = null) => {
  const { data = {} } = useContext(CompanyContext);
  return data[fieldCode] || defaultValue;
};

export const useCompanyData = () => {
  const { data = {} } = useContext(CompanyContext);
  return data;
};

export default CompanyContext;
