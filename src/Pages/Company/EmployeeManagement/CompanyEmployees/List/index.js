import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useCompanyName } from '../../../CompanyContext';
import List from './list';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';

const getEditEmployeeUrl = (employeeId, companyId) => `/company/edit/${companyId}/employee-management/employees/${employeeId}`;

export default function ListWrapper({ match }) {
  const { companyId } = match.params;
  const companyName = useCompanyName();

  return (
    <List
      companyId={companyId}
      companyName={companyName}
      getEditEmployeeUrl={getEditEmployeeUrl}
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
        {
          title: 'Zarządzanie pracownikami',
          link: `/company/edit/${companyId}/employee-management`,
        },
      ]}
    />
  );
}

ListWrapper.propTypes = {
  match: matchPropTypes.isRequired,
};
