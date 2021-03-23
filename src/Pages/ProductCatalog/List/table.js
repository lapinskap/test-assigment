import React, { useCallback, useState } from 'react';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import { SelectFilter, booleanOptions, AutocompleteSelectFilter } from '../../../Components/DataTable/filters';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import __ from '../../../utils/Translations';
import { dynamicNotification } from '../../../utils/Notifications';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import { CATEGORIES_SEPARATOR, useCategoryOptions } from '../EditProduct/utils';
import useSuppliers from '../../../utils/hooks/suppliers/useSuppliers';
import ActionColumn from '../../../Components/DataTable/actionColumn';
import BusinessIdColumn from '../../../Components/DataTable/businessIdColumn';
import { catalogProductPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

export default function BenefitDataTable() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      CATALOG_MANAGEMENT_SERVICE,
      '/products',
      filters,
      page,
      pageSize,
      sort,
      {
      },
      productsMockData,
    );
    setData(newData);
    setCount(newCount);
  }, []);

  const deleteProduct = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        CATALOG_MANAGEMENT_SERVICE,
        `/products/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto produkt'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć produktu'), 'error');
    }
  };

  const categoryOptions = useCategoryOptions();
  const suppliersOptions = useSuppliers(true, false, true);
  const categoryOptionsShortLabel = categoryOptions.map(({ label, value }) => {
    const elements = label.split(CATEGORIES_SEPARATOR);
    return {
      value,
      label: elements[elements.length - 1],
    };
  });
  return (
    <DataTableControlled
      id="catalogProductListing"
      fetchData={fetchData}
      buttons={[
        {
          color: 'primary',
          text: '+ Dodaj',
          href: '/product-catalog/products/-1/-1',
          permission: catalogProductPermissionWrite,
        },
      ]}
      columns={[
        {
          Header: 'Kod produktu',
          accessor: 'id',
          width: 150,
          Cell: BusinessIdColumn,
        },
        {
          Header: 'Włączony',
          accessor: 'active',
          maxWidth: 200,
          Filter: SelectFilter(booleanOptions),
          Cell: mapValueFromOptions(booleanOptions, 'active'),
        },
        {
          Header: 'Nazwa produktu',
          accessor: 'name',
        },
        {
          Header: 'Dostawca',
          accessor: 'supplierId',
          Filter: AutocompleteSelectFilter(suppliersOptions),
          Cell: mapValueFromOptions(suppliersOptions, 'supplierId'),
        },
        {
          Header: 'Kategoria',
          accessor: 'businessCategory',
          Filter: AutocompleteSelectFilter(categoryOptions),
          Cell: mapValueFromOptions(categoryOptionsShortLabel, 'businessCategory'),
        },
        {
          Header: 'Akcja',
          filterable: false,
          sortable: false,
          Cell: (rowData) => (
            <div className="d-block w-100 text-center row">
              <ActionColumn
                data={rowData.row._original}
                buttons={[
                  {
                    id: 'ProductCatalogListingEdit',
                    href: `/product-catalog/products/${rowData.row._original.id}/${rowData.row._original.mbProductType}`,
                    className: 'm-1',
                    color: 'link',
                    label: 'Edytuj',
                  },
                  {
                    id: 'ProductCatalogListingDelete',
                    className: 'm-1',
                    color: 'link',
                    onClick: () => deleteProduct(rowData.row._original.id, true),
                    label: 'Usuń',

                  },
                ]}
              />
            </div>
          ),
        },
      ]}
      data={data}
      count={count}
      filterable
    />
  );
}

export const productsMockData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
    name: 'Bon 50zł do Lidla',
    supplier: 'Anixe',
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea2',
    city: 'Wrocław',
    active: true,
    option: 'AUTOMOTIVE',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Bilet do Muzeum Sztuki Nowożytnej',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea8',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200023',
    name: 'Kurs wioślarstwa',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea4',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200024',
    name: 'Kurs Gotuj Zdrowiej',
    supplier: 'GDS',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea2',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200025',
    name: 'Bilety do Kina Helios',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea3',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200026',
    name: 'Bon do Decathlon',
    supplier: 'GDS',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea8',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200027',
    name: 'Wycieczka do Pragi',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea3',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200028',
    name: 'Kurs języka japońskiego',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea8',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200029',
    name: 'Kurs skakania na skakance',
    supplier: 'GDS',
    active: false,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea4',
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200020',
    name: 'Bon do Empiku',
    supplier: 'Anixe',
    active: true,
    businessCategory: '/api/catalog-management/v1/rest/business-categories/7105a40b-a629-4035-a79e-f1b7c6c50ea2',
  },
];
