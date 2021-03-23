import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function Subscriptions({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const getLegend = () => [
    ['employee_fk', 'numer pracownika w systemie kadrowo-płacowym'],
    ['name', 'imię pracownika, który wykupuje świadczenie'],
    ['surname', 'nazwisko pracownika, który wykupuje świadczenie'],
    ['egb', 'identyfikator bazodanowy benefitu w firmie'],
    ['employer_cost', 'koszt pracodawcy za świadczenie'],
    ['employee_cost', 'koszt pracownika za świadczenie'],
  ];

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
        heading={`Import świadczeń abonamentowych dla firmy ${companyName}`}
        breadcrumbsHeading="Import świadczeń abonamentowych"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          {
            title: 'Importy',
            link: `/company/edit/${companyId}/imports`,
          },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="employee_fk; name; surname; egb; employer_cost;
         employee_cost; start_date; accession_date; additional_name; additional_surname; pesel"
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import świadczeń abonamentowych"
      />
    </CSSTransitionGroup>
  );
}

Subscriptions.propTypes = {
  match: matchPropTypes.isRequired,
};
