import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { MASTERDATA_SERVICE } from '../../../utils/Api';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import ActionColumn from '../../../Components/DataTable/actionColumn';

export default function SuppliersTable({ isTourismSupplier }) {
  const getUrlToForm = (id) => (isTourismSupplier ? `/tourism/suppliers/edit/${id}#view_supplier_data` : `/suppliers/edit/${id}#view_supplier_data`);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      MASTERDATA_SERVICE,
      isTourismSupplier ? '/supplierobject/touristic' : '/supplierobject/nontouristic',
      [
        ...filters,
        {
          id: 'rowsPerPage',
          value: pageSize,
        },
      ],
      page,
      pageSize,
      sort,
      {},
      mockData,
    );
    setData(newData);
    setCount(newCount);
  }, [isTourismSupplier]);

  return (
    <DataTableControlled
      id="tourismSuppliersListing"
      fetchData={fetchData}
      data={data}
      count={count}
      filterable
      columns={[
        {
          Header: 'Nazwa podmiotu',
          accessor: 'supplierName',
        },
        {
          Header: 'Nazwa obiektu',
          accessor: 'objectName',
        },
        {
          Header: 'Obszar',
          accessor: 'objectCooperationArea',
          maxWidth: 200,
        },
        {
          Header: 'Miasto',
          accessor: 'city',
          maxWidth: 200,
        },
        {
          Header: isTourismSupplier ? 'Ilość obiektów' : 'Ilość benefitów',
          accessor: isTourismSupplier ? 'objectsAmount' : 'benefitsAmount',
          filterable: false,
          maxWidth: 200,
        },
        {
          Header: 'Akcja',
          maxWidth: 150,
          filterable: false,
          sortable: false,
          Cell: (rowData) => (
            <div className="d-block w-100 text-center row">
              <ActionColumn
                data={rowData.row._original}
                buttons={[
                  {
                    id: 'tourismSuppliersPreview',
                    className: 'm-1',
                    href: getUrlToForm(rowData.row._original.supplierBusinessID),
                    color: 'link',
                    label: 'Podgląd',
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
      rowId="supplierId"
    />
  );
}
export const mockData = [
  {
    supplierBusinessID: '1',
    city: 'Wrocław',
    objectCooperationArea: 'Cała Polska',
    street: 'Sezamkowa 15',
    objectName: 'YASUMI Sp. z o.o. S.K.',
    country: 'Polska',
    objectsAmount: 2,
    benefitsAmount: 4,
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'GDS, MyBenefit',
    checkbox: false,
  },
  {
    supplierBusinessID: '2',
    city: 'Gdańsk',
    street: 'Sezamkowa 15',
    objectName: 'YASUMI Sp. z o.o. S.K.',
    objectCooperationArea: 'Cała Polska',
    country: 'Polska',
    objectsAmount: 2,
    benefitsAmount: 4,
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'GDS, MyBenefit',
    checkbox: false,
  },
  {
    supplierBusinessID: '3',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'Active Woman',
    country: 'Niemcy',
    objectsAmount: 2,
    objectCooperationArea: 'Cała Polska',
    benefitsAmount: 4,
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'GDS, MyBenefit',
    checkbox: false,
  },
  {
    supplierBusinessID: '4',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'Akademia kreatywności',
    objectCooperationArea: 'Belgia',
    country: 'Belgia',
    status: 'Aktywny',
    objectsAmount: 2,
    benefitsAmount: 4,
    code: '2342346',
    supplierName: 'GDS, MyBenefit',
    checkbox: false,
  },
  {
    supplierBusinessID: '5',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'Akademia fitness',
    country: 'Belgia',
    status: 'Aktywny',
    objectCooperationArea: 'Cała Polska',
    code: '2342346',
    objectsAmount: 2,
    benefitsAmount: 4,
    supplierName: 'ANIXE',
    checkbox: false,
  },
  {
    supplierBusinessID: '6',
    city: 'Gdańsk',
    objectCooperationArea: 'Cała Polska',
    street: 'Sezamkowa 15',
    objectName: 'All For Body',
    country: 'Belgia',
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'ANIXE',
    objectsAmount: 2,
    benefitsAmount: 4,
    checkbox: false,
  },
  {
    supplierBusinessID: '7',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'Kręgielnia kometa',
    code: '2342346',
    country: 'Belgia',
    status: 'Aktywny',
    objectCooperationArea: 'Cała Polska',
    supplierName: 'ANIXE',
    objectsAmount: 2,
    benefitsAmount: 4,
    checkbox: false,
  },
  {
    supplierBusinessID: '8',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'Krav Maga 3 System',
    country: 'Polska',
    objectCooperationArea: 'Cała Polska',
    objectsAmount: 2,
    benefitsAmount: 4,
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'ANIXE',
    checkbox: false,
  },
  {
    supplierBusinessID: '9',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectName: 'B2Carting',
    country: 'Kolonia',
    objectCooperationArea: 'Cała Polska',
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'ANIXE',
    checkbox: false,
  },
  {
    supplierBusinessID: '10',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    objectCooperationArea: 'Cała Polska',
    objectName: 'Mikołajkowo',
    country: 'Niemcy',
    code: '2342346',
    status: 'Aktywny',
    supplierName: 'ANIXE',
    checkbox: false,
  },
];

SuppliersTable.propTypes = {
  isTourismSupplier: PropTypes.bool.isRequired,
};
