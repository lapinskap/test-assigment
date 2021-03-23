import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import Table from './table';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { TYPE_LISTING } from '../../../../../utils/browsingHistory';
import { useCompanyName } from '../../../CompanyContext';

export default function Forms({ match }) {
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
          heading={`Jednostki organizacyjne dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Jednostki organizacyjne"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie pracownikami', link: `/company/edit/${companyId}/employee-management` },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <Table companyId={companyId} />
      </CSSTransitionGroup>
    </>
  );
}
Forms.propTypes = {
  match: matchPropTypes.isRequired,
};
