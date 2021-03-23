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

export default function Changes({ match }) {
  const { companyId } = match.params;

  const companyName = useCompanyName();
  const onSubmit = async (data) => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        '/import/email-fk-changes',
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
  const getLegend = () => [
    ['employee_fk', 'numer pracownika w systemie kadrowo-płacowym'],
    ['new_fk_number', 'nowy numer pracownika w systemie kadrowo-płacowym'],
    ['new_employee_email', 'nowy adres e-mail pracownika'],
  ];

  const instruction = (
    <>
      <ul>
        <li>Plik nie wymaga nagłówka.</li>
      </ul>
    </>
  );

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
        heading={`Import zmian numerów FK i maili dla firmy ${companyName}`}
        breadcrumbsHeading="Import zmian numerów FK i maili"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="employee_fk;new_fk_number;new_employee_email"
        instruction={instruction}
        submitMethod={onSubmit}
        legend={getLegend()}
        title="Import zmian numerów FK i maili"
      />
    </CSSTransitionGroup>
  );
}

Changes.propTypes = {
  match: matchPropTypes.isRequired,
};
