import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function Fundings({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const { companyId } = match.params;
  const companyName = useCompanyName();
  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading={`Import dofinansowań dla firmy ${companyName}`}
        breadcrumbsHeading="Import dofinansowań"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="numer_FK;id_EGB;kwota;komentarz"
        instruction={(
          <>
            <ul>
              <li>Pierwszy wiersz jest nagłówkiem, więc jest ignorowany.</li>
            </ul>
          </>
        )}
        submitMethod={onSubmit}
        legend={[
          ['employee_fk', 'numer pracownika w systemie kadrowo-płacowym'],
          ['id_EGB', 'identyfikator świadczenia'],
          ['kwota', 'kwota dofinansowania'],
          ['komentarz', 'komentarz osoby dofinansowującej'],
        ]}
        title="Import dofinansowań"
      />
    </CSSTransitionGroup>
  );
}

Fundings.propTypes = {
  match: matchPropTypes.isRequired,
};
