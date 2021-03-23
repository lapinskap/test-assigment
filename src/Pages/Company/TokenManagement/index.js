import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Listing from './Listing';
import { getCompanyBaseBreadcrumbs } from '../routerHelper';
import { TYPE_LISTING } from '../../../utils/browsingHistory';
import { useCompanyName } from '../CompanyContext';

export default function TokenManagement({ match }) {
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
          heading={`Zarządzanie tokenami dla firmy ${companyName} (ID: ${match.params.companyId})`}
          breadcrumbsHeading="Zarządzanie tokenami"
          pushToHistory
          historyElementType={TYPE_LISTING}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
          ]}
        />
        <Listing companyId={match.params.companyId} />
      </CSSTransitionGroup>
    </>
  );
}
TokenManagement.propTypes = {
  match: matchPropTypes.isRequired,
};
