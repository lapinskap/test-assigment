import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function SubscriptionResignation({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const getLegend = () => [
    ['employee_fk', 'numer pracownika w systemie kadrowo-płacowym'],
    ['data', 'data dezaktywacji świadczenia w formatach: rrrr-mm-dd , rrrr/mm/dd , rrrr.mm.dd'],
    ['status', 'status świadczeń: AKTYWNE, NIEAKTYWNE, W_POCZEKALNI, WSZYSTKIE'],
    ['id_egb', 'ID benefitu firmowego'],
  ];

  const instruction = (
    <>
      <ul>
        <li>plik nie może zawierać nagłówka,</li>
        <li>import bez podanej daty spowoduje anulowanie pracownikowi świadczeń abonamentowych,</li>
        <ul>
          <li>przy imporcie bez daty należy podać status świadczenia do anulacji,</li>
          <li>dostępne statusy świadczeń: AKTYWNE, NIEAKTYWNE, W_POCZEKALNI, WSZYSTKIE,</li>
          <li>data końca świadczenia równa dacie przystąpienia,</li>
          <li>świadczenia te nie będą widoczne dla AHR'a i pracownika tylko dla OMB,</li>
          <li>nie podajemy daty rezygnacji oraz id benefitu w firmie,</li>
          <li>przykładowy plik: NR_PRACOWNIKA; ;STATUS;,</li>
        </ul>
        <li>import z podaną datą spowoduje zamknięcie tylko aktywnych świadczeń pracownika,</li>
        <ul>
          <li>podana data nie może być datą z przeszłości,</li>
          <li>podając datę rezygnacji ze świadczenia nie podajemy statusu świadczenia oraz id benefitu w firmie,</li>
          <li>przykładowy plik: NR_PRACOWNIKA;2018-01-31;;,</li>
        </ul>
        <li>import zamknięcia świadczeń po id benefitu w firmie,</li>
        <ul>
          <li>zamyka wszystkie świadczenia abonamentowe po id benefitu w firmie z podaną datą,</li>
          <li>podając id benefitu w firmie nie podajemy nr pracownika,</li>
          <li>obowiązkowe kolumny to data, status: AKTYWNE lub W_POCZEKALNI oraz id benefitu w firmie,</li>
          <li>podana data nie może być datą z przeszłości,</li>
          <li>przykładowy plik: ;2018-01-01;AKTYWNE;1111 lub ;2018-01-01;W_POCZEKALNI;1111.</li>
        </ul>
      </ul>
    </>
  );

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
        heading={`Import anulacji świadczeń abonamentowych dla firmy ${companyName}`}
        breadcrumbsHeading="Import anulacji świadczeń abonamentowych"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="employee_fk; data; status; id_egb"
        instruction={instruction}
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import anulacji świadczeń abonamentowych"
      />
    </CSSTransitionGroup>
  );
}

SubscriptionResignation.propTypes = {
  match: matchPropTypes.isRequired,
};
