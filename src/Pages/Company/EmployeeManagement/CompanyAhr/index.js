import React from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';

import PageTitle from '../../../../Layout/AppMain/PageTitle';
import AhrList from './Forms/AhrList';
import AhrGroups from './Forms/AhrRoles';

import SimpleTabs from '../../../../Components/Tabs/SimpleTabs';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { useCompanyName } from '../../CompanyContext';
import { employeeAhrRolePermissionRead } from '../../../../utils/RoleBasedSecurity/permissions';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'ahr_list';
  return hash.split('/')[0];
};

export default function Forms({ match }) {
  const history = useHistory();
  const activeKey = getActiveTab(history.location.hash);

  const companyName = useCompanyName();
  const { companyId } = match.params;

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
          heading={`Edycja administratorów dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Edycja administratorów"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Zarządzanie pracownikami',
              link: `/company/edit/${companyId}/employee-management`,
            },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="general_data"
          tabsConfig={[
            {
              name: 'Administratorzy',
              key: 'ahr_list',
              aclKey: employeeAhrRolePermissionRead,
              component: <AhrList companyId={companyId} />,
            },
            {
              name: 'Role AHR',
              key: 'ahr_role',
              aclKey: employeeAhrRolePermissionRead,
              component: <AhrGroups companyId={companyId} />,
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}
Forms.propTypes = {
  match: matchPropTypes.isRequired,
};
