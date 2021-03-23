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

export default function DeactivateEmployee({ match }) {
  const { companyId } = match.params;
  const onSubmit = async (data) => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        '/import/deactivate-employee',
        'POST',
        {
          body: {
            companyId,
            file: await fileToBase64(data.file[0]),
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano załącznik'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać załącznika'), 'error');
    }
  };

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
        heading={`Import dezaktywacji kont pracowników dla firmy ${companyName}`}
        breadcrumbsHeading="Import dezaktywacji kont pracowników"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="employee_fk;deactivation_date"
        instruction={(
          <>
            <ul>
              <li>Plik nie może zawierać nagłówka.</li>
            </ul>
          </>
        )}
        submitMethod={onSubmit}
        legend={[
          ['employee_fk', 'identyfikator pracownika w systemie kadrowo-płacowym'],
          ['deactivation_date', 'data dezaktywacji w formacie dd-mm-rrrr'],
        ]}
        title="Import dezaktywacji kont pracowników"
      />
    </CSSTransitionGroup>
  );
}

DeactivateEmployee.propTypes = {
  match: matchPropTypes.isRequired,
};
