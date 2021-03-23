import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import General from './General';
import UnsavedChangesPrompt from '../../../../../Components/UnsavedChangesPromt';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function Edit({ match }) {
  const { groupId } = match.params;
  const isNew = groupId === '-1';
  const listingUrl = `/company/edit/${match.params.companyId}/employee-management/rentable-groups`;
  const { companyId } = match.params;
  const companyName = useCompanyName();
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading={isNew
            ? `Tworzenie grupy dochodowości dla firmy ${companyName}`
            : `Edycja grupy dochodowości (ID: ${match.params.groupId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie grupy dochodowości'
            : `Edycja grupy dochodowości (ID: ${match.params.groupId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/employee-management` },
            { title: 'Lista grup dochodowości', link: listingUrl },
          ]}
          pushToHistory={!isNew}
        />
        <UnsavedChangesPrompt>
          <General groupId={groupId} isNew={isNew} listingUrl={listingUrl} companyId={companyId} />
        </UnsavedChangesPrompt>
      </CSSTransitionGroup>
    </>
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
