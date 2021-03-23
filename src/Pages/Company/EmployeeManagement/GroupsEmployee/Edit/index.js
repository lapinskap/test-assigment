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
  const { companyId } = match.params;
  const listingUrl = `/company/edit/${companyId}/employee-management/employee-groups`;
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
            ? `Tworzenie grupy pracowniczej dla firmy ${companyName}`
            : `Edycja grupy pracowniczej (ID: ${match.params.groupId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie grupy pracowniczej'
            : `Edycja grupy pracowniczej (ID: ${match.params.groupId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Zarządzanie pracownikami',
              link: `/company/edit/${companyId}/employee-management`,
            },
            {
              title: 'Lista grup pracowniczych',
              link: listingUrl,
            },
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
