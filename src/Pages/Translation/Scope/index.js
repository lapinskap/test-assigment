import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Form from './Listing';

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
        heading="Zakresy tłumaczeń"
        breadcrumbs={[
          {
            title: 'Tłumaczenia', link: '/translations',
          },
        ]}
      />
      <Form />
    </CSSTransitionGroup>
  </>
);
