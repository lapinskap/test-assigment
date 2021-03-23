import React from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import Simple from './Forms/Simple';
import WithComponents from './Forms/WithComponents';
import WithColumns from './Forms/WithColumns';

import SimpleTabs from '../../../Components/Tabs/SimpleTabs';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'simple';
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
          heading="Formularze"
          breadcrumbs={[]}
        />
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="form1"
          tabsConfig={[
            {
              name: 'Zwykły',
              key: 'simple',
              component: <Simple />,
            },
            {
              name: 'Z Gridem',
              key: 'with_components',
              component: <WithComponents />,
            },
            {
              name: 'Z Kolumnami',
              key: 'with_columns',
              component: <WithColumns />,
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};
