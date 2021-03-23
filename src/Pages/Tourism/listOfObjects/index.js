import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ObjectsTable from './table';

export default function ListOfObjects() {
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
          heading="Lista obiektów"
          breadcrumbs={[
            { title: 'Turystyka', link: '/tourism' },
          ]}
        />
        <ObjectsTable />
      </CSSTransitionGroup>
    </>
  );
}
