import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function SportCardsResignation({ match }) {
  const onSubmit = (data) => {
    console.error(data);
  };

  const getLegend = () => [
    ['numer_fk', 'numer kadrowo-płacowy pracownika'],
    [
      'data_rezygnacji', 'Data rezygnacji, w formacie mm-rrrr, która zostanie wpisana do aktualnie aktywnych kart pracownika.'
    + ' Jeśli aktywne karty mają już ustawioną datę rezygnacji, to podanie daty wcześniejszej skróci czas trwania karty.'
    + ' Podanie daty wcześniejszej niż aktualna data przystąpienia do karty spowoduje jej anulowanie '
    + '(data rezygnacji będzie równa dacie przystąpienia).',
    ],
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
        heading={`Import rezygnacji z kart sportowych dla firmy ${companyName}`}
        breadcrumbsHeading="Import rezygnacji z kart sportowych"
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
        csvForm="numer_fk;data_rezygnacji"
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import rezygnacji z kart sportowych"
      />
    </CSSTransitionGroup>
  );
}

SportCardsResignation.propTypes = {
  match: matchPropTypes.isRequired,
};
