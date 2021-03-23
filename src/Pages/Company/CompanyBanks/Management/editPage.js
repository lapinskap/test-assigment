import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import EditBankForm from './Edit';
import { useCompanyName } from '../../CompanyContext';
import { useBankData } from './Edit/utils';

export default function CompanyBanksEdit({ match }) {
  const { companyId, bankId } = match.params;
  const companyName = useCompanyName();
  const { name = '' } = useBankData(bankId);
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
          pushToHistory
          heading={`Edycja banku punktów: ${name} (ID: ${bankId}) firmy ${companyName}`}
          breadcrumbsHeading={`Edycja banku punktów: ${name} (ID: ${bankId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Banki punktów',
              link: `/company/edit/${companyId}/banks`,
            },
            {
              title: 'Zarządzanie bankami punktów',
              link: `/company/edit/${companyId}/banks/management`,
            },
          ]}
        />
        <EditBankForm companyId={companyId} bankId={bankId} />
      </CSSTransitionGroup>
    </>
  );
}

CompanyBanksEdit.propTypes = {
  match: matchPropTypes.isRequired,
};
