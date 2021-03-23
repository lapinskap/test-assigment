import React from 'react';
import PropTypes from 'prop-types';
import ReportsTable from './table';

const ReportListByGroup = ({ description, groupId, companyId }) => (
  <>
    <h4>{description}</h4>
    <ReportsTable groupId={groupId} companyId={companyId} />
  </>
);

ReportListByGroup.propTypes = {
  description: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};

export default ReportListByGroup;
