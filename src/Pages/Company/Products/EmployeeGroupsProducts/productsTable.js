import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import { SelectFilter, booleanOptions } from '../../../../Components/DataTable/filters';
import EditBenefitModal from './modal';
import {
  CATALOG_MANAGEMENT_SERVICE,
  restApiRequest,
} from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { productsMockData } from '../../../ProductCatalog/List/table';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import EmployeeGroupContext from './employeeGroupContext';
import ActionColumn from '../../../../Components/DataTable/actionColumn';

export default function BenefitDataTable({
  category, categoryConfig, treePath,
}) {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const closeForm = useCallback(() => {
    setEditProduct(null);
  }, [setEditProduct]);

  const { data: contextData } = useContext(EmployeeGroupContext);

  useEffect(() => {
    restApiRequest(
      CATALOG_MANAGEMENT_SERVICE,
      '/products',
      'GET',
      {
        params: {
          businessCategory: category.id,
          itemsPerPage: 10000,
        },
      },
      productsMockData,
    ).then((res) => setProducts(res))
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać produktów'), 'error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let parentCategoryData = {};
    for (let i = 0; i < treePath.length; i += 1) {
      const categoryData = contextData[treePath[i]];
      if (categoryData && categoryData.id && !categoryData.useDefaultSettings) {
        parentCategoryData = categoryData;
        break;
      }
    }
    const productsConfig = categoryConfig.products || {};
    const listingData = products.map(({ name, id }) => {
      const productConfig = productsConfig[id] || {};
      const useDefaultSettings = productConfig.useDefaultSettings !== undefined ? productConfig.useDefaultSettings : true;
      return {
        id,
        name,
        active: productConfig.active !== undefined && !useDefaultSettings ? productConfig.active : Boolean(parentCategoryData.active),
        useDefaultSettings,
      };
    });
    setData(listingData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categoryConfig, contextData]);
  return (
    <>
      <DataTable
        id="employeeGroupsProductListing"
        defaultFilters={defaultFilters}
        data={data}
        filterable
        noCards
        getTrProps={(state, rowInfo) => ({
          style: {
            opacity: rowInfo.row.active ? 1 : 0.5,
          },
        })}
        columns={[
          {
            Header: 'Włączony',
            accessor: 'active',
            Filter: SelectFilter(booleanOptions),
            Cell: mapValueFromOptions(booleanOptions, 'active'),
          },
          {
            Header: 'Wartości domyślne',
            accessor: 'useDefaultSettings',
            Filter: SelectFilter(booleanOptions),
            Cell: mapValueFromOptions(booleanOptions, 'useDefaultSettings'),
          },
          {
            Header: 'Nazwa produktu',
            accessor: 'name',
          },
          {
            Header: 'Akcja',
            filterable: false,
            sortable: false,
            Cell: (rowData) => (
              <div className="d-block w-100 text-center">
                <ActionColumn
                  data={rowData.row._original}
                  buttons={[
                    {
                      id: 'employeeGroupsProductEdit',
                      className: 'm-1',
                      color: 'link',
                      label: 'Edytuj',
                      onClick: () => setEditProduct(rowData.row._original),
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
      {editProduct
        ? (
          <EditBenefitModal
            close={closeForm}
            product={editProduct}
            treePath={treePath}
            category={category}
            categoryConfig={categoryConfig}
          />
        ) : null}
    </>
  );
}

const defaultFilters = [{ id: 'active', value: true }];

BenefitDataTable.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  categoryConfig: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    products: PropTypes.object,
    active: PropTypes.bool,
  }).isRequired,
  treePath: PropTypes.arrayOf(PropTypes.string),

};

BenefitDataTable.defaultProps = {
  treePath: [],
};
