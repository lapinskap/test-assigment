import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function PrepaidCards({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const getLegend = () => [
    ['numer_fk', 'numer kadrowo-płacowy pracownika'],
    ['imie', 'imię pracownika w systemie'],
    ['nazwisko', 'nazwisko pracownika w systemie\n'],
    ['numer_karty', 'numer importowanej karty paliwowej/restauracyjnej/mypremium - akceptowane są jedynie cyfry i litery'],
    ['data_ważności', 'data ważności importowanej karty w formacie dd-mm-rrrr'],
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
        heading={`Import numerów kart przedpłaconych dla firmy ${companyName}`}
        breadcrumbsHeading="Import numerów kart przedpłaconych"
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
        csvForm="numer_fk; imię; nazwisko; numer_karty; data_ważności"
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import numerów kart przedpłaconych"
        additionalFields={[
          {
            type: 'select',
            id: 'type',
            label: 'Rodzaj karty',
            options: [
              {
                value: '1',
                label: 'Karta paliwowa',
              },
              {
                value: '2',
                label: 'Karta Mypremium',
              },
              {
                value: '3',
                label: 'Karta restauracyjna',
              },
            ],
          },
        ]}
      />
    </CSSTransitionGroup>
  );
}

PrepaidCards.propTypes = {
  match: matchPropTypes.isRequired,
};
