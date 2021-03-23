import React from 'react';

const BenefitsContext = React.createContext({
  benefits: [],
  suppliers: [],
  employeeGroups: [],
  benefitsAttachments: [],
  refreshBenefits: () => {},
  openBenefitAttachmentsPopup: () => {},
  changeBenefitGroup: () => {},
});

export default BenefitsContext;
