import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import Listing from './Listing';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { useCompanyName } from '../../CompanyContext';

export default function CompanyBanksListing({ match }) {
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
          pushToHistory
          historyElementType={TYPE_LISTING}
          heading={`Zarządzanie bankami punktów firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Zarządzanie bankami punktów"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Banki punktów',
              link: `/company/edit/${companyId}/banks`,
            },
          ]}
        />
        <Listing
          companyId={companyId}
        />
      </CSSTransitionGroup>
    </>
  );
}

CompanyBanksListing.propTypes = {
  match: matchPropTypes.isRequired,
};
