import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import EditForm from '../../../../Notification/AppMessages/Edit/edit';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function Edit({ match }) {
  const { appMessageId, companyId } = match.params;
  const listingPath = `/company/edit/${companyId}/notification/app-messages`;
  const companyName = useCompanyName();
  return (
    <EditForm
      appMessageId={appMessageId}
      companyScope
      company={companyId}
      listingPath={listingPath}
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
        {
          title: 'Powiadomienia',
          link: `/company/edit/${companyId}/notification`,
        },
        {
          title: 'Lista wiadomości',
          link: listingPath,
        },
      ]}
    />
  );
}

Edit.propTypes = ({
  match: matchPropTypes.isRequired,
});
