import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';

import { Card, CardBody, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import Wizard from '../../../Components/Wizard';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataLoading from '../../../Components/Loading/dataLoading';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import __ from '../../../utils/Translations';
import { dynamicNotification } from '../../../utils/Notifications';
import getDefaultData from './getDefaultData';
import getDefaultSteps from './getDefaultSteps';
import { parseDataFromBackend, parseDataToBackend } from './utils';
import { saveAttachments } from './ProductAttachments/utils';
import SimpleTabs from '../../../Components/Tabs/SimpleTabs';
import { TOURISM_ABROAD_PRODUCT_TYPE } from './productTypes';

export const displayEndpoint = (type, isNew, productId) => {
  if (isNew) {
    return type === TOURISM_ABROAD_PRODUCT_TYPE ? '/foreign-tourism-products' : '/products';
  }
  return type === TOURISM_ABROAD_PRODUCT_TYPE ? `/foreign-tourism-products/${productId}` : `/products/${productId}`;
};

export default function EditProduct({ match }) {
  const { productId, type } = match.params;
  const history = useHistory();
  const isNew = productId === '-1';
  const defaultProductType = type !== '1' ? type : undefined;
  const [data, setData] = useState(isNew ? { mbProductType: defaultProductType } : null);
  const [originalData, setOriginalData] = useState({});
  const [steps, updateSteps] = useState([]);

  const productType = isNew ? data?.mbProductType : type;

  useEffect(() => {
    setData(isNew ? { mbProductType: defaultProductType } : null);
  }, [productId, isNew, defaultProductType]);

  const saveProduct = async () => {
    try {
      const response = await restApiRequest(
        CATALOG_MANAGEMENT_SERVICE,
        displayEndpoint(data.mbProductType, isNew, productId),
        isNew ? 'POST' : 'PATCH',
        {
          body: parseDataToBackend(data),
        },
        data,
      );
      await saveAttachments(data.attachments, response.id);
      setData(parseDataFromBackend(response));
      dynamicNotification(__('Pomyślnie zapisano produkt'));
      return true;
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać produktu'), 'error');
    }
    return false;
  };

  useEffect(() => {
    updateSteps(getDefaultSteps(productType, isNew, productId));
    if (isNew) {
      setData({
        ...data,
        ...getDefaultData(productType),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, isNew, productId]);
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
          heading={isNew ? 'Dodawanie produktu' : `Edytowanie produktu ${originalData?.name || ''} (ID: ${productId})`}
          breadcrumbs={[
            {
              title: 'Katalog produktów',
              link: '/product-catalog',
            },
            { title: 'Lista produktów', link: '/product-catalog/products' },
          ]}
        />
        <Col md="12" lg="12">
          <Card className="main-card mb-3">
            <CardBody>
              {!isNew ? (
                <DataLoading
                  service={CATALOG_MANAGEMENT_SERVICE}
                  fetchedData={data !== null || isNew}
                  updateData={(updatedData) => {
                    const parsedData = parseDataFromBackend(updatedData);
                    setData(parsedData);
                    setOriginalData(parsedData);
                  }}
                  endpoint={type === TOURISM_ABROAD_PRODUCT_TYPE ? `/foreign-tourism-products/${productId}` : `/products/${productId}`}
                  mockDataEndpoint="/products/product1"
                >
                  {steps.length ? (
                    <SimpleTabs
                      activeKey={history.location.hash ? history.location.hash.replace('#', '') : steps[0].key}
                      defaultActiveKey={steps[0].key}
                      tabsConfig={
                            steps.map(({
                              name, Component, props, key,
                            }) => ({
                              name,
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              component: <Component data={data || {}} setData={setData} {...props} next={saveProduct} isNew={isNew} title={name} />,
                              key,
                            }))
                          }
                    />
                  ) : <div />}
                </DataLoading>
              ) : (
                <>
                  {steps.length ? (
                    <Wizard
                      initAllowedStep={productType !== '-1' ? 1 : 0}
                      saveButtonLabel="Zapisz produkt"
                      steps={steps.map(({
                        name, Component, props, submit, blockSteps,
                      }) => ({
                        name,
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        component: <Component data={data || {}} setData={setData} {...props} isNew={isNew} />,
                        submit: submit ? saveProduct : null,
                        blockSteps: blockSteps || false,
                      }))}
                    />
                  ) : null}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </CSSTransitionGroup>
    </>
  );
}

EditProduct.propTypes = {
  match: matchPropTypes.isRequired,
};
