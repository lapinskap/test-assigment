import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Listing from '../../Company/Pending/BenefitsPending/Listing';
import { useCompanyId, useCompanyName } from '../../Company/CompanyContext';

export default () => {
  const companyName = useCompanyName();
  const companyId = useCompanyId();
  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading={`Benefity oczekujące dla firmy ${companyName} (ID: ${companyId})`}
        breadcrumbs={[]}
        pushToHistory
      />
      <Listing companyId={companyId} />
    </CSSTransitionGroup>
  );
};
