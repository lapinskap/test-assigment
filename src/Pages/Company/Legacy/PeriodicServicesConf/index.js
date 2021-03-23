import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Alert } from 'reactstrap';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';

export default function PeriodicServiceConf({ match }) {
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
          heading={`Konf. świadczeń cyklicznych dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Konf. świadczeń cyklicznych"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Przedawnione',
              link: `/company/edit/${companyId}/legacy`,
            },
          ]}
          pushToHistory
        />
        <Alert color="danger">
          <h3>Funkcjonalność MKS - Do Omówienia</h3>
          <div>Należy przedyskutować jak docelowo ta zakładka ma wyglądać i funkcjonować</div>
        </Alert>
      </CSSTransitionGroup>
    </>
  );
}

PeriodicServiceConf.propTypes = {
  match: matchPropTypes.isRequired,
};
