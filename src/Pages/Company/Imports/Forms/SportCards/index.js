import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function SportCards({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const getLegend = () => [
    ['numer_fk', 'numer kadrowo-płacowy pracownika'],
    ['imie', 'imię do karty - jeśli importowany karnet na siebie, to może być puste'],
    ['nazwisko', 'nazwisko do karty - jeśli importowany karnet na siebie, to może być puste'],
    ['id_egb', 'identyfikator bazodanowy benefitu w firmie'],
    ['id_fo', 'identyfikator bazodanowy opcji finansowania'],
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
        heading={`Import kart sportowych dla firmy ${companyName}`}
        breadcrumbsHeading="Import kart sportowych"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="numer_fk;imie;nazwisko;id_egb;id_opcji_finansowania"
        instruction="Plik nie może zawierać nagłówka"
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import kart sportowych"
        additionalFields={[
          {
            type: 'date',
            id: 'start_date',
            label: 'Data startu',
            props: {
              format: 'MM-yyyy',
            },
            tooltip: {
              content: (
                <>
                  Data rozpoczęcia karty - od jakiego miesiąca ma obowiązywać
                </>
              ),
            },
          },
        ]}
      />
    </CSSTransitionGroup>
  );
}

SportCards.propTypes = {
  match: matchPropTypes.isRequired,
};
