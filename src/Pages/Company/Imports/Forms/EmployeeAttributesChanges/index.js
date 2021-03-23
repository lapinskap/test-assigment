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

export default function EmployeeAttributesChanges({ match }) {
  const onSubmit = async (data) => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        '/import/change-employee-attributes',
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
      dynamicNotification(__('Pomyślnie zapisano import'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać importu'), 'error');
    }
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
        heading={`Import zmian cech pracowników dla firmy ${companyName}`}
        breadcrumbsHeading="Import zmian cech pracowników"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="Employee_fK;Rentable_group;Organization_unit;MP;MPK;Company_events_department;Individual_rentable_group_window_open_date;
        Individual_rentable_group_window_close_date;Private_window_open_date;Private_window_close_date"
        instruction={(
          <>
            <ul>
              <li>Plik nie wymaga nagłówka,</li>
              <li>W każdym wierszu musi znajdować się 10 pozycji oddzielonych znakiem średnika,</li>
              <li>Import zmiany cech pracowników służy do aktualizowania już istniejących kont. Nie zakłada nowych.</li>
            </ul>
          </>
        )}
        submitMethod={onSubmit}
        legend={[
          ['Employee_fk', 'Identyfikator pracownika w systemie kadrowo-płacowym'],
          ['Rentable_group', 'Identyfikator grupy dochodowości'],
          ['Organization_unit', 'Identyfikator jednostki organizacyjnej'],
          ['MP', 'Miejsce wykonywania pracy'],
          ['MPK', 'Miejsce powstawania kosztu'],
          ['Company_events_department', '????'],
          ['Individual_rentable_group_window_open_date', 'Indywidualne okno wyboru grup dochodowości ważne od'],
          ['Individual_rentable_group_window_close_date', 'Indywidualne okno wyboru grup dochodowości ważne do'],
          ['Private_window_open_date', 'Indywidualne konto wyboru ważne od'],
          ['Private_window_close_date', 'Indywidualne konto wyboru ważne do'],
        ]}
        title="Import zmian cech pracowników"
      />
    </CSSTransitionGroup>
  );
}

EmployeeAttributesChanges.propTypes = {
  match: matchPropTypes.isRequired,
};
