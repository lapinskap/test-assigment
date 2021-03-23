import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Alert } from 'reactstrap';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import General from './General';
import UnsavedChangesPrompt from '../../../../../Components/UnsavedChangesPromt';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function Edit({ match }) {
  const id = Number(match.params.clusterId);
  const isNew = id === -1;
  const { companyId } = match.params;
  const companyName = useCompanyName();
  return (
    <>
      <Alert color="danger">
        <h3>Zarządzanie funkcjonalnością przeniesione do Magento</h3>
      </Alert>
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
            ? `Tworzenie zrupowania benefitów dla firmy ${companyName}`
            : `Edycja zgrupowania benefitów (ID: ${match.params.clusterId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie zrupowania benefitów'
            : `Edycja zgrupowania benefitów (ID: ${match.params.clusterId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/products` },
            {
              title: 'Lista zgrupowań benefitów',
              link: `/company/edit/${companyId}/products/clusters-benefits`,
            },
          ]}
          pushToHistory={!isNew}
        />
        <UnsavedChangesPrompt>
          <General companyId={companyId} isNew={isNew} id={id} />
        </UnsavedChangesPrompt>
      </CSSTransitionGroup>
    </>
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
