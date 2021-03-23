/* eslint-disable function-call-argument-newline */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { useHistory, Prompt, Link } from 'react-router-dom';
import {
  Card, CardHeader, CardBody,
} from 'reactstrap';
import Sticky from 'react-stickynode';
import RbsButton from '../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';

export default function SidebarTabsWithMemory({
  tabsConfig, defaultKey, promptWhenUnsaved = true, collectiveSaveAction, additionalHeader, submitPermission,
}) {
  const history = useHistory();
  const locationHash = history.location.hash.replace('#', '');
  const [activeKey, setActiveKey] = useState(locationHash || defaultKey);
  const [editedTabs, setEditedTabs] = useState({});

  useEffect(() => () => {
    const { hash } = history.location;
    setActiveKey(hash ? hash.replace('#', '') : defaultKey);
  }, [history.location, defaultKey]);

  const currentKey = activeKey || history.location.hash.replace('#', '');

  const setTabIsEdited = (key, value) => {
    if (editedTabs[key] !== value) {
      const newState = { ...editedTabs };
      newState[key] = value;
      setEditedTabs(newState);
    }
  };

  const getLeaveWarningMessage = (unsavedTabsKeys, location) => {
    if (location.pathname === history.location.pathname) {
      return '';
    }
    const unsavedTabsName = unsavedTabsKeys.map((key) => {
      const tab = tabsConfig.find((el) => el.key === key);
      return tab ? tab.name : null;
    }).filter(Boolean);
    if (unsavedTabsName.length === 1) {
      return `Masz niezapisany formularz w zakładce ${unsavedTabsName[0]}. Niezapisane zmiany zostaną utracone.`;
    }
    return `Masz niezapisane formularze w zakładkach:${unsavedTabsName
      ? ` ${unsavedTabsName.join(', ')}.` : ','} Niezapisane zmiany zostaną utracone.`;
  };

  const unsavedForms = Object.keys(editedTabs).filter((key) => Boolean(editedTabs[key]));
  const currentTab = tabsConfig.find((item) => item.key === currentKey);
  return (
    <Card>
      <div className="forms-wizard-vertical">
        {collectiveSaveAction ? (
          <Sticky top=".app-header" innerZ="100">
            {additionalHeader || null}
            <CardHeader>
              <div className="btn-actions-pane-right">
                <RbsButton
                  permission={submitPermission}
                  size="lg"
                  color="success"
                  type="submit"
                  className="m-2"
                >
                  Zapisz
                </RbsButton>
              </div>
            </CardHeader>
          </Sticky>
        ) : null}
        <div style={{ display: 'flex' }}>
          <div style={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
            <ol className="forms-wizard" style={{ width: '100%' }} data-t1="sidebarTabs">
              {
                    tabsConfig.map(({
                      key, name, icon, invalid,
                    }) => (
                      <Link key={key} to={`#${key}`} data-t1={key}>
                        <li
                          className={`form-wizard-step-${currentKey === key ? 'doing' : 'todo'}`}
                          key={key}
                        >
                          <em><i className={`${icon || 'pe-7s-tools'} btn-icon-wrapper`}> </i></em>
                          <span>{name}</span>
                          <span className="btn-actions-pane-right">
                            {editedTabs[key]
                              ? (
                                <MdModeEdit
                                  fontSize="20px"
                                />
                              ) : null}
                            {invalid ? (
                              <>
                                <string className="text-danger">!</string>
                              </>
                            ) : null}
                          </span>
                        </li>
                      </Link>
                    ))
                                }
            </ol>
          </div>
          <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
            {currentTab ? React.cloneElement(
              currentTab.component,
              { setIsEdited: (value) => setTabIsEdited(activeKey, value) },
            ) : false}
          </CardBody>
        </div>
        {promptWhenUnsaved ? (
          <Prompt
            when={unsavedForms.length > 0}
            message={(location) => getLeaveWarningMessage(unsavedForms, location)}
          />
        ) : null}
      </div>
    </Card>
  );
}

SidebarTabsWithMemory.propTypes = {
  collectiveSaveAction: PropTypes.func,
  submitPermission: PropTypes.string,
  defaultKey: PropTypes.string.isRequired,
  promptWhenUnsaved: PropTypes.bool,
  additionalHeader: PropTypes.node,
  tabsConfig: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    invalid: PropTypes.bool,
  })).isRequired,
};

SidebarTabsWithMemory.defaultProps = {
  collectiveSaveAction: null,
  submitPermission: null,
  additionalHeader: null,
  promptWhenUnsaved: true,
};
