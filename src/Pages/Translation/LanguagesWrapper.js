import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../Layout/AppMain/PageTitle';
import SimpleTabs from '../../Components/Tabs/SimpleTabs';
import { useLanguages } from '../../utils/Languages/LanguageContext';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'en';
  return hash.split('/')[0];
};

export default function LanguageWrapper({ heading, Component }) {
  const history = useHistory();
  const activeKey = getActiveTab(history.location.hash);
  const languages = useLanguages();

  const getTabsConfig = useCallback(() => languages.map(({ code, label }) => ({
    name: label,
    key: code,
    component: React.cloneElement(Component, { language: code }),
  })), [Component, languages]);
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
          heading={heading}
          breadcrumbs={[{ title: 'Tłumaczenia', link: '/translate' }]}
        />
        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="EN"
          tabsConfig={getTabsConfig()}
          destroyInactiveTabPane
        />
      </CSSTransitionGroup>
    </>
  );
}

LanguageWrapper.propTypes = {
  Component: PropTypes.node.isRequired,
  heading: PropTypes.string.isRequired,
};
