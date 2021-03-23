/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useCallback } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import Form from '../../../../Components/Form/index';
import { LAYOUT_TWO_COLUMNS, LAYOUT_THREE_COLUMNS } from '../../../../Components/Layouts';
import { useCompanyName } from '../../CompanyContext';

export default function SubscriptionTopUps({ match }) {
  const { companyId } = match.params;
  const companyName = useCompanyName();
  const [data, setData] = useState([]);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data]);
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
          heading={`Konfiguracja doładowań cyklicznych dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Konfiguracja doładowań cyklicznych"
          pushToHistory
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Świadczenia cykliczne', link: `/company/edit/${companyId}/subscriptions/` },
          ]}
        />
        <Form
          id="subscriptionConfigForm"
          data={data}
          config={{
            title: 'Konfiguracja doładowań cyklicznych',
            stickyTitle: false,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                onClick: () => {

                },
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    layout: LAYOUT_TWO_COLUMNS,
                    formElements: [
                      {
                        type: 'text',
                        name: 'subscriptionDay',
                        label: 'Kwoty doładowań cyklicznych:',
                        id: 'subscriptionDay',
                      },
                      {
                        type: 'date',
                        name: 'workerDay',
                        label: 'Data startu doładowań:',
                        id: 'workerDay',
                      },
                      {
                        type: 'radio',
                        label: 'Częstotliwość doładowań cyklicznych:',
                        id: 'paymentCountDay',
                        options: [
                          { value: 'none', label: 'brak' },
                          { value: '1', label: 'co 1 miesiąc' },
                          { value: '3', label: 'co 3 miesiące' },
                          { value: '6', label: 'co 6 miesięcy' },
                          { value: '12', label: 'co 12 miesięcy' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

SubscriptionTopUps.propTypes = {
  match: matchPropTypes.isRequired,
};
