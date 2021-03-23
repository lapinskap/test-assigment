import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import __ from '../../../../../../utils/Translations';
import DefaultHashTabBar from '../../../../../../Components/Tabs/DefaultHashTabBar';
import ActiveFormsTab from './activeForms';
import PdfForms from './pdfForms';
import { shouldDisableActiveForms } from '../utils';

const activeFormsTab = 'activeForms';
const pdfFormsTab = 'pdfForms';

export default function FormsAssigment({ onChange, data, companyId }) {
  const [activeTab, setActiveTab] = useState(activeFormsTab);
  const activeForms = data?.activeForms || [];
  const pdfForms = data?.pdfForms || [];
  const disableActiveForms = shouldDisableActiveForms(data);
  return (
    <>
      <div className="mb-3">
        <Tabs
          animated
          activeKey={activeTab}
          destroyInactiveTabPane={false}
          renderTabBar={() => <DefaultHashTabBar noCards />}
          renderTabContent={() => <TabContent animated={false} />}
        >
          <TabPane
            tab={`${__('Formularze aktywne')} (${disableActiveForms ? 0 : activeForms.length})`}
            key={activeFormsTab}
            onClick={() => setActiveTab(activeFormsTab)}
          >
            <ActiveFormsTab
              disableAssign={disableActiveForms}
              benefitActiveForms={activeForms}
              updateBenefitActiveForms={(activeFormsList) => onChange('activeForms', activeFormsList)}
            />
          </TabPane>
          <TabPane
            tab={`${__('Formularze PDF')} (${pdfForms.length})`}
            key={pdfFormsTab}
            onClick={() => setActiveTab(pdfFormsTab)}
          >
            <PdfForms
              companyId={companyId}
              benefitPdfForms={pdfForms}
              updateBenefitPdfForms={(pdfFormsList) => onChange('pdfForms', pdfFormsList)}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

FormsAssigment.propTypes = {
  data: PropTypes.shape({
    activeForms: PropTypes.arrayOf(PropTypes.string),
    pdfForms: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
};
