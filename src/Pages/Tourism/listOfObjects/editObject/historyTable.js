import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import { SelectFilter, DateFilter, dateFilterMethod } from '../../../../Components/DataTable/filters';
import { getDateCell, mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import HistoryPreview from './historyPreview';
import { TOURISM_SERVICE } from '../../../../utils/Api';
import useOperators from '../../../../utils/hooks/operator/useOperators';
import ActionColumn from '../../../../Components/DataTable/actionColumn';
import DataLoading from '../../../../Components/Loading/dataLoading';

export default function HistoryTable({ objectId }) {
  const [data, setData] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const [isBeingRestored, setIsBeingRestored] = useState(false);

  useEffect(() => {
    setData(null);
  }, [objectId]);

  const operators = useOperators(true);
  const closeForm = useCallback((refresh = false) => {
    setPreviewId(null);
    if (refresh) {
      setData(null);
    }
  }, [setPreviewId, setData]);

  let previewItem = null;
  if (previewId) {
    previewItem = data.find((item) => item.id === previewId);
  }

  return (
    <DataLoading
      fetchedData={data !== null}
      service={TOURISM_SERVICE}
      endpoint={`/tourism-object-changelogs?objectId=${objectId}&itemsPerPage=10000`}
      mockDataEndpoint="/tourism/object-changelogs"
      updateData={(newData) => setData([...newData])}
    >
      <DataTable
        id="Listing"
        defaultSorted={defaultSorting}
        columns={[
          {
            Header: 'Autor',
            accessor: 'authorId',
            Filter: SelectFilter(operators),
            Cell: mapValueFromOptions(operators, 'authorId'),
          },
          {
            Header: 'Data',
            accessor: 'changedAt',
            minWidth: 200,
            Filter: DateFilter(true),
            filterMethod: dateFilterMethod,
            Cell: getDateCell('changedAt', true),
          },
          {
            Header: 'Czego dotyczy',
            accessor: 'scope',
            Filter: SelectFilter(scopeOptions),
            Cell: mapValueFromOptions(scopeOptions, 'scope'),
          },
          {
            Header: 'Typ operacji',
            accessor: 'operationType',
            Filter: SelectFilter(operationTypes),
            Cell: mapValueFromOptions(operationTypes, 'operationType'),
          },
          {
            Header: 'Akcja',
            maxWidth: 200,
            filterable: false,
            sortable: false,
            Cell: (rowData) => (
              <div className="d-block w-100 text-center row">
                <ActionColumn
                  data={rowData.row._original}
                  buttons={[
                    {
                      id: 'historyTablePreview',
                      className: 'm-1',
                      onClick: () => {
                        setPreviewId(rowData.row._original.id);
                        setIsBeingRestored(false);
                      },
                      color: 'link',
                      label: 'Podgląd',
                    },
                    {
                      id: 'historyTableRestore',
                      className: 'm-1',
                      onClick: () => {
                        setPreviewId(rowData.row._original.id);
                        setIsBeingRestored(true);
                      },
                      color: 'link',
                      label: 'Przywróć',
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        data={data || []}
        filterable
      />

      { previewItem ? (
        <HistoryPreview
          operators={operators}
          close={closeForm}
          isOpen
          previewItem={previewItem}
          isBeingRestored={isBeingRestored}
        />
      ) : null}
    </DataLoading>
  );
}

const scopeOptions = [
  { value: 'basic_info', label: 'Podstawowe informacje' },
  { value: 'photo_gallery', label: 'Galeria zdjęć' },
  { value: 'description', label: 'Opis' },
  { value: 'managing_searching', label: 'Zarządzanie atrybutami e-commerce' },
];
const operationTypes = [
  { value: 'edit', label: 'Edycja' },
  { value: 'revert', label: 'Przywrócenie' },
  { value: 'mass-update', label: 'Masowa aktualizacja' },
  { value: 'import-csv', label: 'Import CSV' },
];

const defaultSorting = [
  {
    id: 'changedAt',
    desc: true,
  },
];
export const mockData = [
  {
    id: '1',
    changedAt: '20-03-2019',
    authorId: 'Stefan Krasnal',
    scope: 'Galeria zdjęć',
    operationType: 'Usunięcie',
  },
  {
    id: '2',
    changedAt: '19-07-2020',
    authorId: 'Stefan Krasnal',
    scope: 'Galeria zdjęć',
    operationType: 'Usunięcie',
  },
  {
    id: '3',
    changedAt: '20-03-2019',
    authorId: 'Anonim',
    scope: 'Galeria zdjęć',
    operationType: 'Edycja',
  },
  {
    id: '4',
    changedAt: '20-03-2019',
    authorId: 'Zbigniew Wodecki',
    scope: 'Galeria zdjęć',
    operationType: 'Usunięcie',
  },
  {
    id: '5',
    changedAt: '20-03-2019',
    authorId: 'Stefan Krasnal',
    operationType: 'Przywrócenie',
    scope: 'Opis',
  },
  {
    objectId: '6',
    changedAt: '19-07-2020',
    authorId: 'Stefan Krasnal',
    operationType: 'Przywrócenie',
    scope: 'Opis',
  },
  {
    id: '7',
    changedAt: '20-03-2019',
    authorId: 'Anna Nowak',
    operationType: 'Przywrócenie',
    scope: 'Opis',
  },
  {
    id: '8',
    changedAt: '20-03-2019',
    authorId: 'Stefan Krasnal',
    operationType: 'Przywrócenie',
    scope: 'Opis',
  },
  {
    objectId: '9',
    changedAt: '20-03-2019',
    operationType: 'Przywrócenie',
    authorId: 'Stefan Krasnal',
    scope: 'Opis',
  },
  {
    id: '10',
    changedAt: '20-03-2019',
    operationType: 'Przywrócenie',
    authorId: 'Anna Nowak',
    scope: 'Opis',
  },
];

HistoryTable.propTypes = {
  objectId: PropTypes.string.isRequired,
};
