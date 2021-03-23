import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import General from './General';
import UnsavedChangesPrompt from '../../../../Components/UnsavedChangesPromt';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';

export default function Edit({ match }) {
  const applicationId = Number(match.params.applicationId);
  const isNew = applicationId === -1;
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
            ? `Tworzenie wniosku dla firmy ${companyName}`
            : `Edycja wniosku dla firmy ${companyName} (ID: ${match.params.applicationId})`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie wniosku'
            : `Edycja wniosku (ID: ${match.params.applicationId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Lista wniosków', link: `/company/edit/${companyId}/application` },
          ]}
          pushToHistory={!isNew}
        />
        <UnsavedChangesPrompt>
          <General applicationId={applicationId} companyId={companyId} />
        </UnsavedChangesPrompt>
      </CSSTransitionGroup>
    </>
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
