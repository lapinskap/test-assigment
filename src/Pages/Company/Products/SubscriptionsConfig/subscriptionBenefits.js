/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';

export default function SubscriptionBenefits({ match }) {
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
          heading={`Świadczenia abonamentowe dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Świadczenia abonamentowe"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Świadczenia cykliczne', link: `/company/edit/${companyId}/subscriptions/benefits/default` },
          ]}
        />
        <div>SubscriptionBenefits</div>
      </CSSTransitionGroup>
    </>
  );
}

SubscriptionBenefits.propTypes = {
  match: matchPropTypes.isRequired,
};
