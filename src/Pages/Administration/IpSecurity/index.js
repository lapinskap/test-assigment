/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import IpTable from './Form/table';
import Form from '../../../Components/Form';

export default () => {
  const [data, updateData] = useState({});
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppeargit
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading="Konfiguracja adresów IP"
          breadcrumbs={[
            {
              title: 'Administracja',
              link: '/administration',
            },
          ]}
        />
        <Form
          id="ipSecurityForm"
          data={data}
          config={
            {
              title: 'Konfiguracja adresów IP, z których można się zalogować do Panelu OMB',
              formGroups: [
                {
                  formElements: [
                    {
                      component: <IpTable key="ip_restictions" />,
                    },
                  ],
                },
              ],
            }
                 }

        />
      </CSSTransitionGroup>
    </>
  );
};
