import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import BenefitDataTable from './table';
import PageTitle from '../../../Layout/AppMain/PageTitle';

export default function BenefitsLists() {
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
          heading="Lista produktów"
          breadcrumbs={[
            {
              title: 'Katalog produktów',
              link: '/product-catalog',
            },
          ]}
        />
        <BenefitDataTable />
      </CSSTransitionGroup>
    </>
  );
}
