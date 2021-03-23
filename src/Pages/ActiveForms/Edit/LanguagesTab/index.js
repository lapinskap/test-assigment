import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Alert } from 'reactstrap';
import DefaultHashTabBar from '../../../../Components/Tabs/DefaultHashTabBar';
import { useLanguages } from '../../../../utils/Languages/LanguageContext';
import __ from '../../../../utils/Translations';
import RbsContext from '../../../../utils/RoleBasedSecurity/RbsContext';
import { hasAccessTo } from '../../../../utils/RoleBasedSecurity/filters';
import {
  translationTranslateCmsPermissionWrite,
  translationTranslateSimplePermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';

export default function LanguagesTabs({ language, setLanguage, allowNotDefault }) {
  const languages = useLanguages(true);
  const { userInfo } = useContext(RbsContext);
  const hasAccessToEditTranslations = hasAccessTo(userInfo, translationTranslateSimplePermissionWrite)
      && hasAccessTo(userInfo, translationTranslateCmsPermissionWrite);
  const panels = languages.map((lang) => ({
    key: lang.code,
    onClick: () => setLanguage(lang.code),
    props: {
      disabled: !lang.isDefault && (!allowNotDefault || !hasAccessToEditTranslations),
      tab: lang.label,
    },
  }));

  let message = null;
  if (!allowNotDefault) {
    message = __('Zmiana treści w innych językach będzie dostępna po pierwszym zapisaniu formularza.');
  } else if (!hasAccessToEditTranslations) {
    message = __('Nie masz uprawnień do edycji tłumaczeń');
  }

  return (
    <div className="rc-tabs rc-tabs-top">
      {message ? (
        <Alert color="warning">
          {message}
        </Alert>
      ) : null}
      <DefaultHashTabBar activeKey={language} panels={panels} />
    </div>
  );
}

LanguagesTabs.propTypes = {
  setLanguage: PropTypes.func.isRequired,
  allowNotDefault: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
};
