import React from 'react';
import { useCompanyId, useCompanyName } from '../../../Company/CompanyContext';
import List from '../../../Company/EmployeeManagement/CompanyEmployees/List/list';
import { getAhrBaseBreadcrumbs } from '../../routerHelper';

const getEditEmployeeUrl = (employeeId) => `/ahr/employees/${employeeId}`;

export default function ListWrapper() {
  const companyName = useCompanyName();
  const companyId = useCompanyId();
  return (
    <List
      companyId={companyId}
      companyName={companyName}
      breadcrumbs={[...getAhrBaseBreadcrumbs(companyName)]}
      getEditEmployeeUrl={getEditEmployeeUrl}
    />
  );
}
