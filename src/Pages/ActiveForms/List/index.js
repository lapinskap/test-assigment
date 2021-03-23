import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ActiveFormList from './list';

export default function List() {
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
        <PageTitle heading="Formularze aktywne" breadcrumbs={[]} />
        <ActiveFormList />
      </CSSTransitionGroup>
    </>
  );
}
