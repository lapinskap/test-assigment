import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import Listing from './Listing';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { useCompanyName } from '../../CompanyContext';

export default function BenefitsPending({ match }) {
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
          heading={`Benefity oczekujące dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Benefity oczekujące"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/pending` },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <Listing companyId={companyId} />
      </CSSTransitionGroup>
    </>
  );
}

BenefitsPending.propTypes = {
  match: matchPropTypes.isRequired,
};
