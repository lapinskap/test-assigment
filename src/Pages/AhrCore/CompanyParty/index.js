import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Alert } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import { useCompanyId, useCompanyName } from '../../Company/CompanyContext';

export default () => {
  const companyName = useCompanyName();
  const companyId = useCompanyId();
  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading={`Imprezy firmowe dla firmy ${companyName} (ID: ${companyId})`}
        breadcrumbs={[]}
        pushToHistory
      />
      <Alert color="danger">
        <h3>Jeszcze nie wdrożone</h3>
      </Alert>
    </CSSTransitionGroup>
  );
};
