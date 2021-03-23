import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import EditForm from './edit';

const listingPath = '/notification/app-messages';

export default function Edit({ match }) {
  const { appMessageId } = match.params;

  return (
    <EditForm
      appMessageId={appMessageId}
      listingPath={listingPath}
      breadcrumbs={[
        {
          title: 'Powiadomienia',
          link: '/notification',
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
