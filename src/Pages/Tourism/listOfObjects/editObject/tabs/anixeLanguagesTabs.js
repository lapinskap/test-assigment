import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import { Button, Input } from 'reactstrap';
import DefaultHashTabBar from '../../../../../Components/Tabs/DefaultHashTabBar';
import __ from '../../../../../utils/Translations';
import Wysiwyg from '../../../../../Components/FormElements/Wysiwyg';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import { getAnixeValueInAllLanguages } from '../utils/anixeData';

export default function AnixeLanguagesTabs(
  {
    data, label, onChange, fieldType, buttonLabel, field, withConfirmation,
  },
) {
  const [activeTab, setActiveTab] = useState(null);
  const values = getAnixeValueInAllLanguages(data, field);
  const languages = Object.keys(values);
  const defaultActiveKey = languages.length ? languages[0] : null;
  const currentKey = activeTab || defaultActiveKey;
  const value = values?.[currentKey];
  return (
    <>
      <div>
        <strong className="mb-3 text-uppercase">{label}</strong>
        <Button
          className="pull-right"
          color="light"
          onClick={() => {
            withConfirmation ? getUserConfirmationPopup(
              __('Wartość pola zostanie nadpisana'),
              (confirm) => confirm && onChange(field, value),
              __('Czy na pewno chcesz skopiować dane?'),
            ) : onChange(field, value);
          }}
        >
          {__(buttonLabel)}
        </Button>
      </div>
      <div className="mb-3">
        <Tabs
          animated
          activeKey={activeTab || defaultActiveKey}
          destroyInactiveTabPane={false}
          renderTabBar={() => <DefaultHashTabBar noCards />}
          renderTabContent={() => <TabContent animated={false} />}
        >
          {Object.keys(values).map((lang) => {
            const tabValue = values?.[lang];
            return tabValue ? (
              <TabPane
                tab={lang.toUpperCase()}
                key={lang}
                onClick={() => setActiveTab(lang)}
              >
                {fieldType === 'wysiwyg' ? (
                  <Wysiwyg
                    id="anixeDescriptionInput"
                    value={tabValue}
                    onChange={() => {}}
                    disabled
                  />
                ) : (
                  <Input type="textarea" value={tabValue} disabled />
                )}
              </TabPane>
            ) : null;
          })}
        </Tabs>
      </div>
    </>
  );
}

AnixeLanguagesTabs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  fieldType: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  withConfirmation: PropTypes.bool.isRequired,
};

AnixeLanguagesTabs.defaultProps = {
  fieldType: 'textarea',
};
