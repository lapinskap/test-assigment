import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Alert } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';

export default () => (
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
        heading="Lista oczekujących transakcji online"
        breadcrumbs={[]}
      />
      <Alert color="danger">
        <h3>Funkcjonalność do przeniesiona do Magento</h3>
      </Alert>
    </CSSTransitionGroup>
  </>
);
