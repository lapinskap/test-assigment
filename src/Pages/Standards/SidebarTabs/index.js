import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { IoIosAlarm, IoIosLock, IoIosApps } from 'react-icons/io';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import SidebarTabsWithMemory from '../../../Components/Tabs/SidebarTabsWithMemory';

import Tab1 from './Tabs/Tab1';
import Tab2 from './Tabs/Tab2';
import Tab3 from './Tabs/Tab3';

export default () => {
  const [data, updateData] = useState({});
  const updateTabData = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const save = (onSuccess) => {
    setTimeout(() => {
      onSuccess();
    }, 500);
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
        <PageTitle
          heading="Boczne zakładki"
          breadcrumbs={[]}
        />
        <SidebarTabsWithMemory
          defaultKey="tab1"
          collectiveSaveAction={save}
          tabsConfig={[
            {
              name: 'Zakładka 1',
              component: <Tab1 data={data} updateTabData={updateTabData} />,
              icon: IoIosApps,
              key: 'tab1',
            },
            {
              name: 'Zakładka 2',
              component: <Tab2 data={data} updateTabData={updateTabData} />,
              icon: IoIosLock,
              key: 'tab2',
            },
            {
              name: 'Zakładka 3',
              component: <Tab3 data={data} updateTabData={updateTabData} />,
              icon: IoIosAlarm,
              key: 'tab3',
            },

          ]}
        />
      </CSSTransitionGroup>
    </>
  );
};
