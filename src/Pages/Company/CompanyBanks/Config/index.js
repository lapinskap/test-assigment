import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import Form from './form';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';

export default function CompanyEdit({ match }) {
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
          heading={`Konfiguracja banków punktów firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Konfiguracja banków punktów"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Banki punktów',
              link: `/company/edit/${companyId}/banks`,
            },
          ]}
        />
        <Form
          companyId={companyId}
        />
      </CSSTransitionGroup>
    </>
  );
}

CompanyEdit.propTypes = {
  match: matchPropTypes.isRequired,
};
