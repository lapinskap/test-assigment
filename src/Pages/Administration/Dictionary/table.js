import React, { useState } from 'react';
import DataTable from '../../../Components/DataTable';
import DataLoading from '../../../Components/Loading/dataLoading';
import { DICTIONARY_SERVICE, restApiRequest } from '../../../utils/Api';
import __ from '../../../utils/Translations';
import { booleanOptions, SelectFilter } from '../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import { dynamicNotification } from '../../../utils/Notifications';
import { dictionaryDictionaryPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import ActionColumn from '../../../Components/DataTable/actionColumn';

const displayDictionaryItems = (items) => {
  if (!items) {
    return null;
  }
  let sortedItems = items.sort((a, b) => a.position - b.position);
  let addDots = false;
  if (sortedItems.length > 10) {
    sortedItems = sortedItems.slice(0, 9);
    addDots = true;
  }
  return (
    <ul>
      {sortedItems.map(({ key, value }) => (
        <li key={key}>
          {key}
          :
          {' '}
          {value}
        </li>
      ))}
      {addDots ? <li>...</li> : null}
    </ul>
  );
};

export default function DictionaryTable() {
  const [data, setData] = useState(null);
  const getUrlToForm = (id) => `/administration/dictionary/${id}`;

  const deleteDictionary = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        DICTIONARY_SERVICE,
        `/dictionaries/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto słownik'));
    } catch (e) {
      setData(data);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć słownika'), 'error');
    }
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
      maxWidth: 100,
    },
    {
      Header: 'Kod',
      accessor: 'code',
    },
    {
      Header: 'Słownik systemowy',
      accessor: 'systemic',
      Filter: SelectFilter(booleanOptions),
      Cell: mapValueFromOptions(booleanOptions, 'systemic'),
    },
    {
      Header: 'Nazwa słownika',
      accessor: 'name',
    },
    {
      Header: 'Pozycje',
      accessor: 'itemsJson',
      filterMethod: itemsJsonFilterMethod,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center">
          {displayDictionaryItems(rowData.row._original.itemsJson)}
        </div>
      ),
    },
    {
      Header: 'Akcja',
      accessor: 'action',
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <ActionColumn
          data={rowData.row._original}
          buttons={[
            {
              id: 'edit',
              href: getUrlToForm(rowData.row._original.id),
            },
            {
              id: 'delete',
              label: 'Usuń',
              permission: dictionaryDictionaryPermissionWrite,
              disabled: Boolean(rowData.row._original.systemic),
              onClick: () => deleteDictionary(rowData.row._original.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataLoading
        service={DICTIONARY_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        endpoint="/dictionaries?itemsPerPage=10000"
        mockDataEndpoint="/dictionaries/list"
      >
        <DataTable
          id="dictionaryListing"
          buttons={[
            {
              id: 'add',
              color: 'primary',
              href: '/administration/dictionary/-1',
              text: '+ Dodaj słownik',
              permission: dictionaryDictionaryPermissionWrite,
            },
          ]}
          filterable
          columns={columns}
          data={data || []}
        />
      </DataLoading>
    </>
  );
}

const itemsJsonFilterMethod = ({ id, value }, row) => {
  const searchValue = value && value.toLowerCase();
  const cellValue = row[id];
  if (!cellValue || !Array.isArray(cellValue)) {
    return false;
  }
  for (let i = 0; i < cellValue.length; i += 1) {
    const { key, value: itemValue } = cellValue[i];
    if (key && key.toLowerCase().includes(searchValue)) {
      return true;
    }
    if (itemValue && itemValue.toLowerCase().includes(searchValue)) {
      return true;
    }
  }

  return false;
};
