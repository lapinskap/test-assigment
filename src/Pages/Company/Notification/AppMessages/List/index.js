import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import AppMessagesList from '../../../../Notification/AppMessages/List/list';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function List({ match }) {
  const { companyId } = match.params;
  const getUrlToForm = (id) => `/company/edit/${companyId}/notification/app-messages/${id}`;
  const companyName = useCompanyName();
  return (
    <AppMessagesList
      companyScope
      company={companyId}
      getUrlToForm={getUrlToForm}
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
        {
          title: 'Powiadomienia',
          link: `/company/edit/${companyId}/notification`,
        },
      ]}
    />
  );
}

List.propTypes = ({
  match: matchPropTypes.isRequired,
});
