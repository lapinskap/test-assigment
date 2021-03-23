import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import Tree from './Tree';

export default function BusinessCategory() {
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
          heading="Kategorie biznesowe2"
          breadcrumbs={[
            {
              title: 'Katalog produktów',
              link: '/product-catalog',
            },
          ]}
        />
        <Tree />
      </CSSTransitionGroup>
    </>
  );
}
