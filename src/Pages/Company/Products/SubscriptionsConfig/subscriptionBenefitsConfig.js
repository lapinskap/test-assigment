import React from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';
import SingleSectionConfiguration from '../../../Administration/Configuration/singleSection';
import useEmployeeGroups from '../../../../utils/hooks/company/useEmployeeGroups';

export default function SubscriptionBenefitsConfig({ match }) {
  const { companyId, employeeGroupId } = match.params;
  const companyName = useCompanyName();
  const employeeGroups = useEmployeeGroups(false, 'companyId', companyId, false, !employeeGroupId);
  const history = useHistory();

  const employeeGroup = employeeGroupId ? employeeGroups.find(({ id }) => id === employeeGroupId) : null;

  return (
    <SingleSectionConfiguration
      sectionId="subscription"
      scope={{
        companyId,
        employeeGroupId,
      }}
      changeScope={(company, groupId) => {
        history.push(`/company/edit/${companyId}/subscriptions/config${groupId ? `/${groupId}` : ''}`);
      }}
      showSwitcher
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
        { title: 'Świadczenia cykliczne', link: `/company/edit/${companyId}/subscriptions` },
      ]}
      heading={employeeGroupId
        ? `Konfiguracja świadczeń abonamentowych dla grupy pracowniczej ${employeeGroup?.name || ''} (ID: ${employeeGroupId})`
        : `Konfiguracja świadczeń abonamentowych dla firmy ${companyName} (ID: ${companyId})`}
      breadcrumbsHeading="Konfiguracja świadczeń abonamentowych"
    />
  );
}

SubscriptionBenefitsConfig.propTypes = {
  match: matchPropTypes.isRequired,
};
