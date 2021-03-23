import React, {
  useCallback, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import Attachments from './Forms/Attachments';
import CompanyData from './Forms/CompanyData';
import GeneralConfig from './Forms/GeneralConfig';
// import ManageNames from './Forms/ManageNames';
import IpAdministration from './Forms/IpAdministration';
import TabsWithMemory from '../../../Components/Tabs/TabsWithMemory';
import { getCompanyBaseBreadcrumbs } from '../routerHelper';
import { useCompanyName } from '../CompanyContext';
import {
  companyAttachmentPermissionRead,
  companyCompanyPermissionRead, ssoIpAddressRestrictionPermissionRead,
} from '../../../utils/RoleBasedSecurity/permissions';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'company_data';
  return hash.split('/')[0];
};

export default function CompanyEdit({ match }) {
  const [{ title, breadcrumbs, breadcrumbsHeading }, setPageTitleData] = useState({});
  const { companyId } = match.params;
  const history = useHistory();

  const companyName = useCompanyName();

  const changePageTitleData = useCallback((newTitle, newBreadcrumbs = [], newBreadcrumbsHeading = null) => {
    setPageTitleData({ title: newTitle, breadcrumbs: newBreadcrumbs, breadcrumbsHeading: newBreadcrumbsHeading });
  }, [setPageTitleData]);

  const activeKey = getActiveTab(history.location.hash);
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
          heading={title || `Edycja firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading={title ? breadcrumbsHeading : 'Edycja firmy'}
          breadcrumbs={title ? [
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Edycja firmy', link: '#company_data' },
            ...breadcrumbs,
          ] : [
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
          ]}
          pushToHistory
        />
        <TabsWithMemory
          activeKey={activeKey}
          defaultActiveKey="company_data"
          tabsConfig={[
            {
              name: 'Dane firmy',
              key: 'company_data',
              aclKey: companyCompanyPermissionRead,
              component: <CompanyData
                changePageTitleData={changePageTitleData}
                companyId={companyId}
              />,
            },
            {
              name: 'Załączniki',
              key: 'attachments',
              aclKey: companyAttachmentPermissionRead,
              component: <Attachments
                changePageTitleData={changePageTitleData}
                companyId={companyId}
              />,
            },
            {
              name: 'Konfiguracja',
              key: 'general_config',
              aclKey: companyCompanyPermissionRead,
              component: <GeneralConfig
                changePageTitleData={changePageTitleData}
                companyId={companyId}
              />,
            },
            // {
            //   name: 'Zarządzanie nazwami',
            //   key: 'manage_names',
            //   aclKey: 'manage_names',
            //   component: <ManageNames
            //     changePageTitleData={changePageTitleData}
            //     companyId={companyId}
            //   />,
            // },
            {
              name: 'IP administratorów',
              key: 'ip_administration',
              aclKey: ssoIpAddressRestrictionPermissionRead,
              component: <IpAdministration
                changePageTitleData={changePageTitleData}
                companyId={companyId}
              />,
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
}

CompanyEdit.propTypes = {
  match: matchPropTypes.isRequired,
};
