/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import SupliersTable from './table';
import { mockData } from './mockData';

export default function ListOfSuppliers({ match }) {
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
          heading="Lista dostawców"
          breadcrumbs={[
            { title: 'Turystyka', link: '/tourism/suppliers' },
          ]}
        />
        {/* <div className="col-sm-12 row">
          <Link to="add-supplier" className="d-block text-right btn-action-pane-right"><Button color="primary">+ Dodaj</Button></Link>
        </div> */}
        <SupliersTable isTourismSupplier mockData={mockData} />
      </CSSTransitionGroup>
    </>
  );
}

ListOfSuppliers.propTypes = {
  match: matchPropTypes.isRequired,
};
