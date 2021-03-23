import PropTypes from 'prop-types';
import React from 'react';
import DefaultHashTabBar from '../Tabs/DefaultHashTabBar';
import { useLanguages } from '../../utils/Languages/LanguageContext';

export default function LanguagesTabs({ currLanguage, setCurrLanguage }) {
  const languages = useLanguages();
  const panels = languages.map((lang) => ({
    key: lang.code,
    onClick: () => setCurrLanguage(lang.code),
    props: {
      tab: lang.label,
    },
  }));
  return (
    <div className="rc-tabs rc-tabs-top">
      <DefaultHashTabBar activeKey={currLanguage} panels={panels} />
    </div>
  );
}

LanguagesTabs.propTypes = {
  setCurrLanguage: PropTypes.func.isRequired,
  currLanguage: PropTypes.string.isRequired,
};
