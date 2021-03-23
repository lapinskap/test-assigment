/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../Layout/AppMain/PageTitle';

export default function AddSupplier({ match }) {
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
          heading="Dodawanie dostawcy"
          breadcrumbs={[
            { title: 'Turystyka', link: '/tourism/add-supplier' },
          ]}
        />
      </CSSTransitionGroup>
      Formularz dodawania dostawcy
    </>
  );
}

AddSupplier.propTypes = {
  match: matchPropTypes.isRequired,
};
