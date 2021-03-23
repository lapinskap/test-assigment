/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import {
  Input, CardTitle, CardHeader, Card,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import Category from './category';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import { useCompanyName } from '../../CompanyContext';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import useEmployeeGroups from '../../../../utils/hooks/company/useEmployeeGroups';
import {
  CATALOG_MANAGEMENT_SERVICE, EMPLOYEE_GROUP_PRODUCT_SERVICE, COMPANY_MANAGEMENT_SERVICE, restApiRequest,
} from '../../../../utils/Api';
import DefaultFallback from '../../../../Layout/AppMain/DefaultFallback';
import EmployeeGroupContext from './employeeGroupContext';
import treeData from '../../../ProductCatalog/BusinessCategory/Tree/mockTreeData';

export default function BenefitsLists({ match }) {
  const [categoriesTree, setCategoriesTree] = useState(null);
  const [paymentsConfig, setPaymentsConfig] = useState([]);
  const [employeeGroupConfig, setEmployeeGroupConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const companyName = useCompanyName();
  const { companyId } = match.params;

  const history = useHistory();
  const { hash } = history.location;

  const employeeGroupId = hash ? hash.replace('#', '') : null;

  const employGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  useEffect(() => {
    restApiRequest(
      COMPANY_MANAGEMENT_SERVICE,
      '/points-banks/company',
      'GET',
      {
        params: {
          pointsBankCompanyId: companyId,
        },
      },
      mockPaymentsConfig,
    ).then((resData) => {
      setPaymentsConfig([
        ...resData,
        ...ownPaymentsConfig,
      ]);
    })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać listy banków i składników płacowych'), 'error'));
  }, [companyId]);

  const refreshEmployeeGroupConfig = () => restApiRequest(
    EMPLOYEE_GROUP_PRODUCT_SERVICE,
    '/employee-group-product-configs',
    'GET',
    {
      params: {
        companyId,
        employeeGroupId,
        itemsPerPage: 10000,
      },
    },
    mockEmployeeGroupProducts,
  ).then((resData) => {
    setEmployeeGroupConfig(resData.length && resData[0][employeeGroupId] ? resData[0][employeeGroupId] : {});
  }).catch((e) => {
    dynamicNotification(e.message || __('Nie udało się pobrać aktualnej konfiguracji grupy pracowniczej'), 'error');
  });

  useEffect(() => {
    setLoading(true);
    if (employeeGroupId) {
      restApiRequest(
        EMPLOYEE_GROUP_PRODUCT_SERVICE,
        '/employee-group-product-configs',
        'GET',
        {
          params: {
            companyId,
            employeeGroupId,
            itemsPerPage: 10000,
          },
        },
        mockEmployeeGroupProducts,
      )
        .then((resData) => {
          setEmployeeGroupConfig(resData.length && resData[0][employeeGroupId] ? resData[0][employeeGroupId] : {});
          setError(false);
          setLoading(false);
        })
        .catch((e) => {
          dynamicNotification(e.message || __('Nie udało się pobrać aktualnej konfiguracji grupy pracowniczej'), 'error');
          setEmployeeGroupConfig([]);
          setError(true);
          setLoading(false);
        });
    }
  }, [companyId, employeeGroupId]);
  useEffect(() => {
    if (employGroups.length && !employeeGroupId) {
      const defaultEmployeeGroupId = employGroups[0].value;
      history.push({
        hash: defaultEmployeeGroupId,
      });
    }
  }, [employGroups, employeeGroupId, history]);

  useEffect(() => {
    restApiRequest(
      CATALOG_MANAGEMENT_SERVICE,
      '/get-structured-business-categories',
      'GET',
      {},
      treeData,
    )
      .then((resData) => {
        setCategoriesTree(resData);
      })
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać drzewa kategorii'), 'error');
        setCategoriesTree([]);
      });
  }, []);
  let content;
  if (employeeGroupId) {
    if (!categoriesTree || loading) {
      content = DefaultFallback;
    } else if (error) {
      content = (
        <Card>
          <CardHeader><CardTitle>{__('Coś poszło nie tak, spróbuj ponownie')}</CardTitle></CardHeader>
        </Card>
      );
    } else if (categoriesTree.length) {
      content = categoriesTree.map((category) => (
        <Category
          category={category}
          hasParent={false}
          key={category.id}
        />
      ));
    } else {
      content = (
        <Card>
          <CardHeader><CardTitle>{__('Brak kategorii do wyświetlenia')}</CardTitle></CardHeader>
        </Card>
      );
    }
  }

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
          heading={`Lista produktów dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Lista produktów"
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Zarządzanie produktami', link: `/company/edit/${companyId}/products` },
          ]}
          pushToHistory
          historyElementType={TYPE_LISTING}
        />
        <div className="col-sm-12 row m-3">
          <h5 className="col-sm-5">Ustawienia dla grup pracowniczych</h5>
          <Input
            type="select"
            value={employeeGroupId}
            onChange={(e) => history.push({ hash: e.target.value })}
            name="select"
            className="col-sm-7"
            id="exampleSelect"
          >
            {employGroups.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
          </Input>
        </div>
        {employeeGroupId ? (
          <span className="m-3">
            <span>
              <CardTitle>KATEGORIE</CardTitle>
              <EmployeeGroupContext.Provider value={{
                data: employeeGroupConfig, employeeGroupId, companyId, refreshEmployeeGroupConfig, paymentsConfig,
              }}
              >
                {content}
              </EmployeeGroupContext.Provider>
            </span>
          </span>
        ) : null}
      </CSSTransitionGroup>
    </>
  );
}

const ownPaymentsConfig = [
  {
    id: 'payu',
    name: 'Płatność online',
    type: 'ONLINE_PAYMENT',
    hasFirstPayrollNumber: false,
    hasSecondPayrollNumber: false,
  },
];

BenefitsLists.propTypes = {
  match: matchPropTypes.isRequired,
};

export const mockPaymentsConfig = [
  {
    id: 'csdas-234254',
    name: 'Bank punktów 1',
    type: 'BANK_OF_POINTS',
    hasFirstPayrollNumber: true,
    hasSecondPayrollNumber: false,
  },
  {
    id: 'csdas-7674',
    name: 'Bank punktów 2',
    type: 'BANK_OF_POINTS',
    hasFirstPayrollNumber: true,
    hasSecondPayrollNumber: false,
  },
  {
    id: 'csdas-234234',
    name: 'Bank ZFŚS',
    type: 'BANK_OF_POINTS',
    hasFirstPayrollNumber: true,
    hasSecondPayrollNumber: true,
  },
];

const mockEmployeeGroupProducts = [{
  'a43275e4-eeb2-11ea-adc1-0242ac1200021': {
    'b43275e4-eeb2-11ea-adc1-0242ac1200022': {
      id: 'b3afa48b-2dff-4180-8814-318c6d862a4d',
      employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      businessCategoryId: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
      active: true,
      useDefaultSettings: true,
      settings: [],
      products: {
        'a43275e4-eeb2-11ea-adc1-0242ac1200021': {
          id: '155481d1-516b-43e3-b170-32ddf5f9c67b',
          employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          businessCategoryId: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
          productId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          active: true,
          useDefaultSettings: true,
          settings: [],
        },
        'a43275e4-eeb2-11ea-adc1-0242ac1200022': {
          id: '155481d1-516b-43e3-b170-32ddf5f9c67b',
          employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          businessCategoryId: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
          productId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          active: false,
          useDefaultSettings: true,
          settings: [],
        },
        'a43275e4-eeb2-11ea-adc1-0242ac1200023': {
          id: '155481d1-516b-43e3-b170-32ddf5f9c67b',
          employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          businessCategoryId: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
          productId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
          active: true,
          useDefaultSettings: false,
          settings: [{
            active: true, type: 'BANK_OF_POINTS', id: 'csdas-234254', payrollNumberFirst: '222',
          },
          {
            active: true, type: 'BANK_OF_POINTS', id: 'csdas-7674', payrollNumberFirst: '111',
          },
          { active: false, type: 'BANK_OF_POINTS', id: 'csdas-234234' },
          { active: false, type: 'ONLINE_PAYMENT', id: 'payu' }],
        },
      },
    },
    'a43275e4-eeb2-11ea-adc1-0242ac1200022': {
      id: '7e4fb91f-5231-49a3-ae79-27e8309f3fd3',
      employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      businessCategoryId: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
      active: true,
      useDefaultSettings: false,
      settings: [{
        active: true, type: 'BANK_OF_POINTS', id: 'csdas-234254', payrollNumberFirst: '123',
      },
      { active: false, type: 'BANK_OF_POINTS', id: 'csdas-7674' },
      { active: false, type: 'BANK_OF_POINTS', id: 'csdas-234234' },
      { active: false, type: 'ONLINE_PAYMENT', id: 'payu' },
      ],
    },
  },
}];
