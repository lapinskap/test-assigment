import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Card, CardHeader } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ScopeSwitcher from '../../../Components/ScopeSwitcher';
import DocumentsManagement from './documentsManagement';

export default function CmsManagement({ match }) {
  const history = useHistory();

  const { companyId, employeeGroupId } = match.params;
  const scope = {
    companyId: companyId !== 'default' ? companyId : null,
    employeeGroupId: employeeGroupId !== 'default' ? employeeGroupId : null,
  };

  const changeScope = (newCompanyId, newEmployeeGroupId) => {
    let url = `/cms/management/${newCompanyId || 'default'}/${newEmployeeGroupId || 'default'}`;
    const currentHash = history.location.hash;
    if (currentHash) {
      url += `${currentHash}`;
    }
    history.push(url);
  };
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
        <PageTitle heading="Zarządzanie CMS" breadcrumbs={[]} />
        <Card className="my-3">
          <CardHeader>
            <div className="w-100"><ScopeSwitcher changeScope={changeScope} scope={scope} /></div>
          </CardHeader>
        </Card>
        <DocumentsManagement
          key={`${scope.companyId}_${scope.employeeGroupId}`}
          companyId={scope.companyId}
          employeeGroupId={scope.employeeGroupId}
        />
      </CSSTransitionGroup>
    </>
  );
}
CmsManagement.propTypes = {
  match: matchPropTypes.isRequired,
};
