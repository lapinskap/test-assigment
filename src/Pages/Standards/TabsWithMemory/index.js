import React from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import Form1 from './Forms/Form1';
import Form2 from './Forms/Form2';
import Form3 from './Forms/Form3';

import TabsWithMemory from '../../../Components/Tabs/TabsWithMemory';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'form1';
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
          heading="Zakładki z zapamiętywaniem"
          breadcrumbs={[]}
        />
        <TabsWithMemory
          activeKey={activeKey}
          defaultActiveKey="form1"
          tabsConfig={[
            {
              name: 'Formularz 1',
              key: 'form1',
              aclKey: 'standards',
              component: <Form1 />,
            },
            {
              name: 'Formularz 2',
              key: 'form2',
              aclKey: 'standards',
              component: <Form2 />,
            },
            {
              name: 'Formularz 3',
              key: 'form3',
              aclKey: 'standards',
              component: <Form3 />,
            },
          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};
