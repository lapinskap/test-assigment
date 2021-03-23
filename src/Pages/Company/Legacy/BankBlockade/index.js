import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import Core from './Core';
import { useCompanyName } from '../../CompanyContext';

export default function EditMenu({ match }) {
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
          heading={`Edycja blokad banków dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Edycja blokad banków"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Przedawnione',
              link: `/company/edit/${companyId}/legacy`,
            },
          ]}
          pushToHistory
        />
        <Core />
      </CSSTransitionGroup>
    </>
  );
}
EditMenu.propTypes = {
  match: matchPropTypes.isRequired,
};
