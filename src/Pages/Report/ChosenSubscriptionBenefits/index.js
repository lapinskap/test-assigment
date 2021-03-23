import React from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import Subscription from './Subscription';
import OneTime from './OneTime';
import OneTimeByCategory from './OneTimeByCategory';
import SimpleTabs from '../../../Components/Tabs/SimpleTabs';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'subscription';
  return hash.split('/')[0];
};

export default () => {
  const history = useHistory();

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
          heading="Raport wybranch świadczeń"
          breadcrumbs={[]}
        />
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="subscription"
          tabsConfig={[
            {
              name: 'Świadczenia abonamentowe',
              key: 'subscription',
              component: <Subscription />,
            },
            {
              name: 'Świadczenia jednorazowe',
              key: 'one_time',
              component: <OneTime />,
            },
            {
              name: 'Świadczenia jednorazowe wg kategorii',
              key: 'one_time_by_categories',
              component: <OneTimeByCategory />,
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};
