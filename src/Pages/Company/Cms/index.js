import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Card, CardHeader } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ScopeSwitcher from '../../../Components/ScopeSwitcher';
import DocumentsManagement from '../../Cms/Management/documentsManagement';
import { useCompanyName } from '../CompanyContext';
import { getCompanyBaseBreadcrumbs } from '../routerHelper';

export default function CmsManagement({ match }) {
  const history = useHistory();

  const { companyId, employeeGroupId } = match.params;
  const scope = {
    companyId,
    employeeGroupId: employeeGroupId !== 'default' ? employeeGroupId : null,
  };

  const changeScope = (newCompanyId, newEmployeeGroupId) => {
    let url = `/company/edit/${companyId}/cms/management/${newEmployeeGroupId || 'default'}`;
    const currentHash = history.location.hash;
    if (currentHash) {
      url += `${currentHash}`;
    }
    history.push(url);
  };

  const companyName = useCompanyName();

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading={`Zarządzanie CMS dla firmy ${companyName} (${companyId})`}
          breadcrumbsHeading="Zarządzanie CMS"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
          ]}
        />
        <Card className="my-3">
          <CardHeader>
            <div className="w-100"><ScopeSwitcher changeScope={changeScope} scope={scope} skipCompany /></div>
          </CardHeader>
        </Card>
        <DocumentsManagement
          key={`${companyId}_${scope.employeeGroupId}`}
          companyId={companyId}
          employeeGroupId={scope.employeeGroupId}
        />
      </CSSTransitionGroup>
    </>
  );
}
CmsManagement.propTypes = {
  match: matchPropTypes.isRequired,
};
