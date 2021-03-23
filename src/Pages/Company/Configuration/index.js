import React from 'react';
import { CardHeader } from 'reactstrap';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import ScopeSwitcher from '../../../Components/ScopeSwitcher';
import Configuration from '../../Administration/Configuration/configuration';
import { getCompanyBaseBreadcrumbs } from '../routerHelper';
import { useCompanyName } from '../CompanyContext';

export default function ConfigurationWrapper({ match }) {
  const history = useHistory();
  const { companyId, employeeGroupId } = match.params;
  const companyName = useCompanyName();
  const scope = {
    companyId: companyId !== 'default' ? companyId : null,
    employeeGroupId: employeeGroupId !== 'default' ? employeeGroupId : null,
  };
  const changeScope = (newCompanyId, newEmployeeGroupId) => {
    let url = `/company/edit/${companyId}/configuration/${newEmployeeGroupId || 'default'}`;
    const currentHash = history.location.hash;
    if (currentHash) {
      url += `${currentHash}`;
    }
    history.push(url);
  };
  const additionalHeader = (
    <CardHeader>
      <div className="w-100"><ScopeSwitcher changeScope={changeScope} scope={scope} skipCompany /></div>
    </CardHeader>
  );

  return (
    <Configuration
      scope={scope}
      additionalHeader={additionalHeader}
      breadcrumbs={[
        ...getCompanyBaseBreadcrumbs(companyId, companyName),
      ]}
    />
  );
}
ConfigurationWrapper.propTypes = {
  match: matchPropTypes.isRequired,
};
