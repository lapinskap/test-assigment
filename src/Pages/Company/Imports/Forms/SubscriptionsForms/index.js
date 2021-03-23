import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';

export default function SubscriptionsForms({ match }) {
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

  const instruction = (
    <ul>
      <li>Plik nie może zawierać nagłówka,</li>
      <li>tylko pliki zakodowane w WIN1250 są wspierane.</li>
    </ul>
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
        heading={`Import formularzy świadczeń abonamentowych dla firmy ${companyName}`}
        breadcrumbsHeading="Import formularzy świadczeń abonamentowych"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="numer_fk; imię; nazwisko; numer_karty; data_ważności"
        submitMethod={onSubmit}
        instruction={instruction}
        legend={getLegend()}
        title="Import formularzy świadczeń abonamentowych"
        additionalFields={[
          {
            type: 'select',
            id: 'type',
            label: 'Wybierz dostawcę',
            options: [
              { value: '1', label: 'Luxmed' },
              { value: '2', label: 'Medicover' },
              { value: '3', label: 'Enelmed' },
              { value: '4', label: 'PZU SA.' },
            ],
          },
        ]}
      />
    </CSSTransitionGroup>
  );
}

SubscriptionsForms.propTypes = {
  match: matchPropTypes.isRequired,
};
