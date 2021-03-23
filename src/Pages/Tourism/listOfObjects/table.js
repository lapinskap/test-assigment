import React, { useCallback, useState } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import __ from '../../../utils/Translations';
import { SelectFilter, objectStatusOptions } from '../../../Components/DataTable/filters';
import ImportForm from './importForm';
import { TOURISM_SERVICE, downloadFile } from '../../../utils/Api';
import useDictionary from '../../../utils/hooks/dictionaries/useDictionary';
import { DICTIONARY_COUNTRIES } from '../../../utils/hooks/dictionaries/dictionariesCodes';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import RbsButton from '../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { tourismTourismAttributePermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../Components/DataTable/actionColumn';
import { getAnixeValue } from './editObject/utils/anixeData';

export default function ObjectsTable() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [openImportPopup, setOpenImportPopup] = useState(false);
  const closeImportForm = useCallback(() => {
    setOpenImportPopup(false);
  }, [setOpenImportPopup]);
  const history = useHistory();
  const getUrlToForm = (id) => `/tourism/objects/edit/${id}#basic_info`;

  const countriesOptions = useDictionary(DICTIONARY_COUNTRIES);

  const parseDataFromBackend = (newData) => newData.map((record) => {
    const item = { ...record };
    item.countryCode = getAnixeValue(record?.anixeData || {}, 'countryCode');
    return item;
  });

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      TOURISM_SERVICE,
      '/tourism-objects',
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
      tourismObjectsMockData,
    );
    setData(parseDataFromBackend(newData));
    setCount(newCount);
  }, []);

  const downloadCSV = async (allObjects) => {
    downloadFile(
      TOURISM_SERVICE,
      allObjects ? '/tourism-objects/export' : `/tourism-objects/export${history.location.search}`,
      `eksport_obiektow_turystycznych_${new Date()}.csv`,
    );
  };

  const columns = [
    {
      Header: 'Kod obiektu',
      accessor: 'anixeId',
    },
    {
      Header: 'Pełna nazwa obiektu',
      accessor: 'name',
    },
    {
      Header: 'Lista dostawców',
      accessor: 'suppliers',
    },
    {
      Header: 'Państwo',
      accessor: 'countryCode',
      Filter: SelectFilter(countriesOptions),
      Cell: mapValueFromOptions(countriesOptions, 'countryCode'),
    },
    {
      Header: 'Miasto',
      accessor: 'city',
      maxWidth: 150,
    },
    {
      Header: 'Status',
      accessor: 'status',
      maxWidth: 150,
      Filter: SelectFilter(objectStatusOptions),
      Cell: mapValueFromOptions(objectStatusOptions, 'status'),
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
                id: 'tourismObjectEdit',
                className: 'm-1',
                href: getUrlToForm(rowData.row._original.id),
                color: 'link',
                label: 'Edytuj',
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row col-sm-12">
        <div className="d-block btn-actions-pane-right mb-3 row">
          <Button
            className="mx-2"
            data-t1="tourismObjectsDownloadCSVAll"
            color="primary"
            onClick={() => downloadCSV(true)}
          >
            {__('Eksportuj do CSV wszystkie obiekty')}
          </Button>
          <Button
            color="primary"
            onClick={() => downloadCSV(false)}
            data-t1="tourismObjectsDownloadCSVSelected"
          >
            {__('Eksportuj do CSV wyfiltrowane obiekty')}
          </Button>
          <RbsButton
            permission={tourismTourismAttributePermissionWrite}
            className="mx-2"
            onClick={() => setOpenImportPopup(true)}
            color="primary"
            data-t1="tourismObjectsImportCSV"
          >
            {__('Importuj z CSV')}
          </RbsButton>
        </div>
      </div>
      <DataTableControlled
        id="tourismObjectListing"
        filterable
        columns={columns}
        data={data || []}
        count={count}
        fetchData={fetchData}
        rowId="id"
        massActions={[
          {
            label: 'Aktualizacja atrybutów obiektów',
            id: 'update',
            action: (included, excluded, filters) => {
              const params = new URLSearchParams({ included, excluded, filters: JSON.stringify(filters) });
              history.push(`/tourism/objects/mass-attribite-update?${params.toString()}`);
            },
          },
        ]}
      />
      { openImportPopup ? (<ImportForm close={closeImportForm} isOpen={openImportPopup} />) : null }
    </>
  );
}

export const tourismObjectsMockData = [
  {
    id: '1',
    anixeId: '1',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Polska',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'GDS, MyBenefit',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '2',
    anixeId: '2',
    city: 'Gdańsk',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Polska',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'GDS, MyBenefit',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '3',
    anixeId: '3',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Krasnal',
    countryCode: 'Niemcy',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'GDS, MyBenefit',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '4',
    anixeId: '4',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'U Róży',
    countryCode: 'Belgia',
    status: 'Aktywny',
    code: '2342346',
    suppliers: 'GDS, MyBenefit',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '5',
    anixeId: '5',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Belgia',
    status: 'Aktywny',
    code: '2342346',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '6',
    anixeId: '6',
    city: 'Gdańsk',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Belgia',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '7',
    anixeId: '7',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Mikołajkowo',
    code: '2342346',
    countryCode: 'Belgia',
    status: 'Aktywny',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '8',
    anixeId: '8',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Polska',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '9',
    anixeId: '9',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Pod Dużym Krasnalem',
    countryCode: 'Niemcy',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
  {
    id: '10',
    anixeId: '10',
    city: 'Wrocław',
    street: 'Sezamkowa 15',
    name: 'Mikołajkowo',
    countryCode: 'Niemcy',
    code: '2342346',
    status: 'Aktywny',
    suppliers: 'ANIXE',
    checkbox: false,
    anixeData: {},
  },
];
