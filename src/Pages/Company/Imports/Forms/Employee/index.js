import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import ImportForm from '../../ImportForm';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../../routerHelper';
import { useCompanyName } from '../../../CompanyContext';
import { fileToBase64 } from '../../../../../utils/Parsers/fileToBase64';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';

export default function Employee({ match }) {
  const { companyId } = match.params;
  const onSubmit = async (data) => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        '/import/employee',
        'POST',
        {
          body: {
            companyId,
            file: await fileToBase64(data.file[0]),
          },
          returnNull: true,
        },
        null,
      );
      dynamicNotification(__('Pomyślnie zapisano załącznik'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało dokonać importu'), 'error');
    }
  };

  const getLegend = () => [
    ['Name', 'Imię'],
    ['Surname', 'Nazwisko'],
    ['Position', 'Stanowisko'],
    ['Username', 'Unikatowa nazwa użytkownika (jeżeli jest puste zostanie wygenerowane na podstawie imienia i nazwiska)'],
    ['E-mail', 'E-mail'],
    ['Employee_fk', 'Identyfikator pracownika w systemie kadrowo-płacowym'],
    ['Employee_group', 'Identyfikator grupy pracowniczej'],
    ['Date_activate', 'Konto aktywne od'],
    ['Password', 'Hasło'],
    ['Province', 'Województwo (numer id województwa w formacie PL-*)'],
    ['Organization_unit', 'Identyfikator jednostki organizacyjnej'],
    ['Rentable_group', 'Identyfikator grupy dochodowości'],
    ['PESEL', 'Numer PESEL pracownika (11 cyfr)'],
    ['MP', 'Miejsce wykonywania pracy'],
    ['MPK', 'Miejsce powstanie kosztu'],
  ];

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
        heading={`Import pracowników dla firmy ${companyName}`}
        breadcrumbsHeading="Import pracowników"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="name;surname;position;username;email;number;employee_group;organization_unit;rentable_group"
        instruction="Plik nie wymaga nagłówka"
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import pracowników"
      />
    </CSSTransitionGroup>
  );
}

Employee.propTypes = {
  match: matchPropTypes.isRequired,
};
