import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import Tabs from '../../../Company/EmployeeManagement/CompanyEmployees/Edit/tabs';
import { useCompanyId, useCompanyName } from '../../../Company/CompanyContext';
import { getAhrBaseBreadcrumbs } from '../../routerHelper';

export default function Edit({ match }) {
  const { employeeId } = match.params;
  const companyName = useCompanyName();
  const companyId = useCompanyId();

  return (
    <Tabs
      isAhr
      listingUrl="/ahr/employees"
      companyId={companyId}
      companyName={companyName}
      employeeId={employeeId}
      breadcrumbs={[
        ...getAhrBaseBreadcrumbs(companyName),
        {
          title: 'Lista pracowników',
          link: '/ahr/employees',
        },
      ]}
    />
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
