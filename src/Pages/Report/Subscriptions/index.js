import React, { useContext } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import SubscriptionList from './List';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';
import { getAhrUrl } from '../helpers/ahrHelper';

export default () => {
  const rbsContext = useContext(RbsContext);
  const isAhr = rbsContext.userInfo.isAhr();
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
          heading="Lista aktywnych wysyłek"
          breadcrumbs={[
            { title: 'Raporty', link: getAhrUrl('/report', isAhr) },
          ]}
        />
        <SubscriptionList isAhr={isAhr} />
      </CSSTransitionGroup>
    </>
  );
};
