import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DictionaryTable from './table';

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
        heading="Lista słowników"
        breadcrumbs={[{
          link: '/administration',
          title: 'Administracja',
        }]}
      />
      <DictionaryTable />
    </CSSTransitionGroup>
  </>
);
