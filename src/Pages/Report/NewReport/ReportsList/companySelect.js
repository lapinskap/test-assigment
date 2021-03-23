import React from 'react';
import PropTypes from 'prop-types';

const CompanySelect = ({ companies, selectCompany }) => {
  const companyChange = (e) => {
    const companytargetId = e.target.value;

    selectCompany(companytargetId);
  };

  const renderCompaniesOptions = () => {
    if (Array.isArray(companies)) {
      return companies.map((item) => {
        if (item.isSelected) {
          companyChange({ target: { value: item.value } });
        }
        return <option key={item.value} value={item.value} selected={item.isSelected}>{item.label}</option>;
      });
    }
    return null;
  };

  return (
    <div className="form-group">
      <select className="form-control col-5" onChange={companyChange} defaultValue="-1">
        <option value="-1" disabled hidden>Wybór firmy</option>
        {renderCompaniesOptions()}
      </select>
    </div>
  );
};

CompanySelect.propTypes = {
  companies: PropTypes.arrayOf.isRequired,
  selectCompany: PropTypes.func.isRequired,
};
export default CompanySelect;
