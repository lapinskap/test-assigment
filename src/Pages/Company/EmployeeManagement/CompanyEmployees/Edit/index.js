import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';
import Tabs from './tabs';

export default function Edit({ match }) {
  const { employeeId, companyId } = match.params;
  const companyName = useCompanyName();

  return (
    <Tabs
      companyId={companyId}
      companyName={companyName}
      employeeId={employeeId}
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
        {
          title: 'Zarządzanie pracownikami',
          link: `/company/edit/${companyId}/employee-management`,
        },
        {
          title: 'Lista pracowników',
          link: `/company/edit/${companyId}/employee-management/employees`,
        },
      ]}
    />
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
