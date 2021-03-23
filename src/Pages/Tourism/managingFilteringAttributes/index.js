import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import SimpleTabs from '../../../Components/Tabs/SimpleTabs';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ManagingAttributes from './managingAttributes/index';
import History from './history/index';
import {
  tourismTourismAttributePermissionRead,
  tourismTourismObjectChangelogPermissionRead,
} from '../../../utils/RoleBasedSecurity/permissions';

export default function ManagingFilteringAttributes() {
  const history = useHistory();

  const getActiveTab = (hashValue) => {
    const hash = hashValue ? hashValue.replace('#', '') : 'managing_filtering_attributes';
    return hash.split('/')[0];
  };

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
      />
      <PageTitle
        heading="Zarządzanie atrybutami filtrowania"
        breadcrumbs={[
          { title: 'Turystyka', link: '/tourism/managing-filtering-attributes' },
        ]}
      />
      <SimpleTabs
        activeKey={activeKey}
        defaultActiveKey="tourism"
        tabsConfig={[
          {
            name: 'Zarządzanie atrybutami filtrowania',
            key: 'managing_filtering_attributes',
            aclKey: tourismTourismAttributePermissionRead,
            component: <ManagingAttributes />,
          },
          {
            name: 'Historia zmian',
            key: 'history',
            aclKey: tourismTourismObjectChangelogPermissionRead,

            component: <History />,
          },
        ]}
      />

    </>
  );
}
