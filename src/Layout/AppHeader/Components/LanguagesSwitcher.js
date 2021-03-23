import React, { useState } from 'react';
import {
  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown,
} from 'reactstrap';
import Flag from 'react-flagkit';
import { setLanguage, useLanguages, getLanguage } from '../../../utils/Languages/LanguageContext';

const codeFlagMap = {
  pl: 'PL',
  en: 'GB',
  uk: 'UA',
};

export default function LanguagesSwitcher() {
  const [lang, setLang] = useState(getLanguage());
  const languages = useLanguages(true);
  if (languages.length <= 1) {
    return null;
  }

  const changeLanguage = (key) => {
    setLang(key);
    setLanguage(key);
    window.location.reload();
  };

  const currentLanguage = languages.find((el) => el.code === lang);
  return (
    <UncontrolledDropdown data-t1="languageSwitcher">
      <DropdownToggle className="p-0 mr-2" color="link">
        <div className="icon-wrapper icon-wrapper-alt rounded-circle">
          <div className="icon-wrapper-bg bg-focus" />
          <div className="language-icon">
            <Flag className="mr-3 opacity-8" country={currentLanguage ? codeFlagMap[currentLanguage.code] : 'JE'} size="40" />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="rm-pointers">
        <div className="dropdown-menu-header">
          <div className="dropdown-menu-header-inner pt-4 pb-4 bg-focus">
            <div className="menu-header-image opacity-05" />
            <div className="menu-header-content text-center text-white">
              <h6 className="menu-header-subtitle mt-0">
                Wybierz język
              </h6>
            </div>
          </div>
        </div>
        {languages.map(({ code, label }) => (
          <DropdownItem key={code} active={code === lang} onClick={() => changeLanguage(code)}>
            <Flag className="mr-3 opacity-8" country={codeFlagMap[code] || 'JE'} />
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
