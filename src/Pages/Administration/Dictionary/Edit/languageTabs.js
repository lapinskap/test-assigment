import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import SimpleTabs from '../../../../Components/Tabs/SimpleTabs';
import LanguageTab from './tab';
import { useLanguages } from '../../../../utils/Languages/LanguageContext';
import { DefaultLoader } from '../../../../Components/Loading/loaders';

export default function LanguageTabs({
  items, updateItems, errorMessage, validate, isSystemic,
}) {
  const history = useHistory();

  const getActiveTab = (hashValue) => {
    const hash = hashValue ? hashValue.replace('#', '') : 'pl';
    return hash.split('/')[0];
  };

  const activeKey = getActiveTab(history.location.hash);
  const languages = useLanguages(true);
  if (!items) {
    return <DefaultLoader />;
  }
  return (
    <>
      <SimpleTabs
        activeKey={activeKey}
        defaultActiveKey="PL"
        tabsConfig={languages.map(({ code, isDefault, label }) => (
          {
            name: label,
            key: code,
            component: <LanguageTab
              items={items}
              updateItems={updateItems}
              lang={code}
              isSystemic={isSystemic}
              isDefault={isDefault}
              errorMessage={errorMessage}
              validate={validate}
            />,
          }
        ))}
      />
    </>
  );
}

LanguageTabs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array,
  updateItems: PropTypes.func.isRequired,
  isSystemic: PropTypes.bool.isRequired,
  validate: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  errorMessage: PropTypes.object,
};

LanguageTabs.defaultProps = {
  items: null,
  errorMessage: null,
  validate: null,
};
