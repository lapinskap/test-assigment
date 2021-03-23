import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import BenefitsSettings from './settingsForm';
import EmployeeGroupContext, { useProductConfig } from './employeeGroupContext';
import { EMPLOYEE_GROUP_PRODUCT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import Popup from '../../../../Components/Popup/popup';

export default function EditBenefitModal({
  close, treePath, product, category, categoryConfig,
}) {
  const {
    employeeGroupId, companyId, refreshEmployeeGroupConfig, paymentsConfig,
  } = useContext(EmployeeGroupContext);

  const onSubmit = (formData) => {
    const productsConfig = categoryConfig.products || {};
    const configId = productsConfig[product.id] ? productsConfig[product.id].id : null;
    return restApiRequest(
      EMPLOYEE_GROUP_PRODUCT_SERVICE,
      `/employee-group-product-configs${configId ? `/${configId}` : ''}`,
      configId ? 'PATCH' : 'POST',
      {
        body: {
          companyId,
          businessCategoryId: category.id,
          employeeGroupId,
          productId: product.id,
          ...formData,
        },
      },
      {},
    )
      .then(() => {
        dynamicNotification(__('Pomyślnie zapisane konfigurację'));
        refreshEmployeeGroupConfig();
        close();
      })
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się zapisać konfiguracji'), 'error');
      })
      .finally(() => refreshEmployeeGroupConfig());
  };

  const productConfig = useProductConfig(category.id, product.id);
  return (
    <Popup id="productSettingPopup" isOpen toggle={close} unmountOnClose size="xxl">
      <BenefitsSettings
        isProductEdit
        paymentsConfig={paymentsConfig}
        name={product.name}
        close={close}
        originalData={productConfig}
        parentCategoryName={category.name}
        hasParent
        onSubmit={onSubmit}
        treePath={treePath}
      />
    </Popup>
  );
}

EditBenefitModal.propTypes = {
  close: PropTypes.func.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  categoryConfig: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    products: PropTypes.object,
  }).isRequired,
  product: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  treePath: PropTypes.arrayOf(PropTypes.string),

};

EditBenefitModal.defaultProps = {
  treePath: [],
};
