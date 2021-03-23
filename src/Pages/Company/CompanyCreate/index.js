import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import CompanyData from './Forms/CompanyData';

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
        heading="Tworzenie firmy"
        breadcrumbs={[{ title: 'Lista firm', link: '/company/list' }]}
      />
      <CompanyData active setIsEdited={() => {}} changePageTitleData={() => {}} />
    </CSSTransitionGroup>
  </>
);
