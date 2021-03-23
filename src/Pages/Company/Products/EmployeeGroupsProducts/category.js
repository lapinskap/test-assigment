/* eslint-disable no-unused-vars, react/no-array-index-key */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse, CardBody, Card, CardTitle,
} from 'reactstrap';
import BenefitSettings from './settingsForm';
import { CATEGORY_TYPE_PRODUCT } from '../../../ProductCatalog/BusinessCategory/Tree/utils';
import ProductsTable from './productsTable';
import EmployeeGroupContext, { useCategoryConfig } from './employeeGroupContext';
import { EMPLOYEE_GROUP_PRODUCT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';

export default function Category({
  category, parentCategoryName, hasParent, treePath,
}) {
  const {
    name, type, subcategories, id,
  } = category;
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    employeeGroupId, companyId, refreshEmployeeGroupConfig, paymentsConfig,
  } = useContext(EmployeeGroupContext);
  const categoryConfig = useCategoryConfig(id);
  const toggle = () => {
    setIsOpen(!isOpen);
    setIsInitialized(true);
  };

  const onSubmit = (formData) => {
    const configId = categoryConfig.id;
    return restApiRequest(
      EMPLOYEE_GROUP_PRODUCT_SERVICE,
      `/employee-group-product-configs${configId ? `/${configId}` : ''}`,
      configId ? 'PATCH' : 'POST',
      {
        body: {
          companyId,
          businessCategoryId: id,
          employeeGroupId,
          ...formData,
        },
      },
      {},
    )
      .then(() => dynamicNotification(__('Pomyślnie zapisane konfigurację')))
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się zapisać konfiguracji'), 'error');
      })
      .finally(() => refreshEmployeeGroupConfig());
  };

  let content;
  if (!isInitialized) {
    content = null;
  } else if (type === CATEGORY_TYPE_PRODUCT) {
    content = (
      <>
        <BenefitSettings
          paymentsConfig={paymentsConfig}
          name={name}
          originalData={categoryConfig}
          parentCategoryName={parentCategoryName}
          hasParent={hasParent}
          onSubmit={onSubmit}
          treePath={treePath}
        />
        <ProductsTable category={category} treePath={[id, ...treePath]} categoryConfig={categoryConfig} />
      </>
    );
  } else {
    content = (
      <>
        <BenefitSettings
          paymentsConfig={paymentsConfig}
          name={name}
          originalData={categoryConfig}
          parentCategoryName={parentCategoryName}
          hasParent={hasParent}
          onSubmit={onSubmit}
          treePath={treePath}
        />
        {subcategories ? subcategories.map((subcategory) => (
          <Category
            key={subcategory.id}
            category={subcategory}
            parentCategoryName={name}
            hasParent
            treePath={[id, ...treePath]}
          />
        )) : null}
      </>
    );
  }
  return (
    <div>
      <Card className="mt-3">
        <CardBody className="row" onClick={toggle}>
          <CardTitle className="mx-3">{name}</CardTitle>
          {isOpen ? <i className="pe-7s-angle-up pe-3x pe-va mr-3 btn-actions-pane-right" />
            : <i className="pe-7s-angle-down pe-3x pe-va mr-3 btn-actions-pane-right" />}
        </CardBody>
      </Card>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            {content}
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
}

Category.propTypes = {
  parentCategoryName: PropTypes.string,
  treePath: PropTypes.arrayOf(PropTypes.string),
  hasParent: PropTypes.bool,
  category: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    subcategories: PropTypes.array,
  }).isRequired,
};
Category.defaultProps = {
  hasParent: false,
  parentCategoryName: null,
  treePath: [],
};
