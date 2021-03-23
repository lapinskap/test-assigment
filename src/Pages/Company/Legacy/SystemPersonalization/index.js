import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Alert } from 'reactstrap';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { useCompanyName } from '../../CompanyContext';

export default function SystemPersonalization({ match }) {
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
          heading={`Personalizacja systemu dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Personalizacja systemu"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Przedawnione',
              link: `/company/edit/${companyId}/legacy`,
            },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <Alert color="danger">
          <h3>Prawdopodobnie legacy</h3>
          <div>Funkcjonalność "Personalizacja systemu" najprawdopodobnie przeniesiona do systemu E-commerce</div>
        </Alert>
        <img src="/Raw/img-tmp/system-personalization.png" alt="preview" />
      </CSSTransitionGroup>
    </>
  );
}

SystemPersonalization.propTypes = {
  match: matchPropTypes.isRequired,
};
