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

export default function Groups({ match }) {
  const { companyId } = match.params;
  const companyName = useCompanyName();

  const onSubmit = async (data) => {
    try {
      await restApiRequest(
        EMPLOYEE_MANAGEMENT_SERVICE,
        '/import/groups',
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
        heading={`Import grup pracowniczych i grup dochodowości dla firmy ${companyName}`}
        breadcrumbsHeading="Import grup pracowniczych i grup dochodowości"
        breadcrumbs={[
          ...getCompanyBaseBreadcrumbs(companyId, companyName),
          { title: 'Importy', link: `/company/edit/${companyId}/imports` },
        ]}
        pushToHistory
      />
      <ImportForm
        csvForm="employee_fk; employee_group; rentable_group"
        submitMethod={onSubmit}
        legend={[
          ['employee_fk', 'numer pracownika w systemie kadrowo-płacowym'],
          ['employee_group', 'grupa pracownicza (ID grupy pracowniczej)'],
          ['rentable_group', 'grupa dochodowości (ID grupy dochodowości)'],
        ]}
        title="Import grup pracowniczych i grup dochodowości"
      />
    </CSSTransitionGroup>
  );
}

Groups.propTypes = {
  match: matchPropTypes.isRequired,
};
