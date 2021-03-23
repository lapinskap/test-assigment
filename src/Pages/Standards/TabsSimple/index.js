import React from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import { Alert } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';

import SimpleTabs from '../../../Components/Tabs/SimpleTabs';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'tab1';
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
          heading="Zakładki"
          breadcrumbs={[]}
        />
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="tab1"
          tabsConfig={[
            {
              name: 'Tab 1',
              key: 'tab1',
              component: (
                <Alert color="warning">
                  <h3>Pierwsza (domyślna) zakładka</h3>
                </Alert>
              ),
            },
            {
              name: 'Tab 2',
              key: 'tab2',
              component: (
                <Alert color="danger">
                  <h3>Kolejna zakładka</h3>
                </Alert>
              ),
            },
            {
              name: 'Tab 3',
              key: 'tab3',
              component: (
                <Alert color="primary">
                  <h3>Jeszcze jedna zakładka</h3>
                </Alert>
              ),
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};
