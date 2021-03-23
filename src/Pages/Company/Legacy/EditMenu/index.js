import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Alert } from 'reactstrap';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
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
          heading={`Edycja menu dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Edycja menu"
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
          <h3>Prawdopodobnie legacy</h3>
          <div>Funkcjonalność "Edycja Menu" najprawdopodobnie przeniesiona do systemu E-commerce</div>
        </Alert>
        <img src="/Raw/img-tmp/menu-edit.png" alt="preview" />
      </CSSTransitionGroup>
    </>
  );
}
EditMenu.propTypes = {
  match: matchPropTypes.isRequired,
};
