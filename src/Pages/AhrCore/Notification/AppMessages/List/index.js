import React from 'react';
import AppMessagesList from '../../../../Notification/AppMessages/List/list';
import { useCompanyId, useCompanyName } from '../../../../Company/CompanyContext';
import { getAhrBaseBreadcrumbs } from '../../../routerHelper';

export default function List() {
  const getUrlToForm = (id) => `/ahr/notification/app-messages/${id}`;
  const companyName = useCompanyName();
  const companyId = useCompanyId();
  return (
    <AppMessagesList
      companyScope
      company={companyId}
      getUrlToForm={getUrlToForm}
      breadcrumbs={[
        ...getAhrBaseBreadcrumbs(companyName),
        {
          title: 'Powiadomienia',
          link: `/company/edit/${companyId}/notification`,
        },
      ]}
    />
  );
}
