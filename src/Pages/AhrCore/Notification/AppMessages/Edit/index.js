import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import EditForm from '../../../../Notification/AppMessages/Edit/edit';
import { useCompanyName, useCompanyId } from '../../../../Company/CompanyContext';
import { getAhrBaseBreadcrumbs } from '../../../routerHelper';

export default function Edit({ match }) {
  const { appMessageId } = match.params;

  const listingPath = '/ahr/notification/app-messages';
  const companyName = useCompanyName();
  const companyId = useCompanyId();
  return (
    <EditForm
      appMessageId={appMessageId}
      companyScope
      company={companyId}
      listingPath={listingPath}
      breadcrumbs={[
        ...getAhrBaseBreadcrumbs(companyName),
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
