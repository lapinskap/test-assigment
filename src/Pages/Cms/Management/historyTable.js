import React, { useState } from 'react';
import {
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../Components/DataTable';
import { SelectFilter, DateFilter, dateFilterMethod } from '../../../Components/DataTable/filters';
import __ from '../../../utils/Translations';
import { getDateCell } from '../../../Components/DataTable/commonCells';
import { CMS_SERVICE } from '../../../utils/Api';
import DataLoading from '../../../Components/Loading/dataLoading';
import PreviewPopup from './previewPopup';
import PublishPopup from './publishPopup';
import { DOCUMENT_IRI } from './util';
import ActionColumn from '../../../Components/DataTable/actionColumn';

export default function HistoryTable({ documentId, setRefreshData, refreshDocumentsTree }) {
  const [publishVersion, setPublishVersion] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [data, setData] = useState(null);

  if (!documentId) {
    return null;
  }

  const showAdditionalButton = (rowData) => {
    const { published, pending, id } = rowData;
    if (pending) {
      return (
        <Button
          role="button"
          onClick={() => {
            setPublishVersion(id);
          }}
          color="link"
        >
          {__('Publikuj')}
        </Button>
      );
    } if (!pending && !published) {
      return (
        <Button
          role="button"
          onClick={() => {
            setPublishVersion(id);
          }}
          color="link"
        >
          {__('Przywróć')}
        </Button>
      );
    }
    return <div />;
  };
  return (
    <>
      <DataLoading
        service={CMS_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData.sort((a, b) => {
          if (a.pending) {
            return -1;
          }
          if (a.published && !b.pending) {
            return -1;
          }
          return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1;
        }))}
        endpoint={`/document-versions?document=${DOCUMENT_IRI}${documentId}`}
        mockDataEndpoint="/cms/document-versions"
      >
        <DataTable
          id="documentVersionHistoryListing"
          filterable
          columns={[
            {
              Header: 'Wersja',
              accessor: 'id',
              width: 100,
            },
            {
              Header: 'Data',
              accessor: 'updatedAt',
              Filter: DateFilter(),
              filterMethod: dateFilterMethod,
              Cell: getDateCell('updatedAt'),
            },
            {
              Header: 'Status',
              accessor: 'status',
              Filter: SelectFilter(statusOptions),
              filterMethod: ({ value }, row) => {
                const published = row._original.published ? '1' : '0';
                const pending = row._original.pending ? '1' : '0';
                const rowValue = `${published}_${pending}`;
                return rowValue === value;
              },
              Cell: (rowData) => (
                <div className="d-block w-100 text-center row">
                  {getStatusLabel(rowData.row._original)}
                </div>
              ),
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
                        id: 'cmsPreview',
                        role: 'button',
                        color: 'link',
                        onClick: () => {
                          setPreviewVersion(rowData.row._original.id);
                        },
                        label: 'Podgląd',
                      },

                    ]}
                  />
                  {showAdditionalButton(rowData.row._original)}
                </div>
              ),
            },
          ]}
          data={data || []}
        />
      </DataLoading>
      { publishVersion ? (
        <PublishPopup
          close={(refresh = false) => {
            setPublishVersion(null);
            if (refresh) {
              refreshDocumentsTree();
              setRefreshData(true);
              setData(null);
            }
          }}
          versionId={publishVersion}
          documentId={documentId}
        />
      ) : null}
      { previewVersion ? <PreviewPopup close={() => setPreviewVersion(null)} versionId={previewVersion} /> : null}
    </>
  );
}

const getStatusLabel = ({ published, pending }) => {
  let label = 'Archiwalna';
  if (published) {
    label = 'Opublikowana';
  } else if (pending) {
    label = 'Nieopublikowana';
  }
  return label;
};

const statusOptions = [
  { label: 'Nieopublikowana', value: '0_1' },
  { label: 'Opublikowana', value: '1_0' },
  { label: 'Archiwalna', value: '0_0' },
];

HistoryTable.propTypes = {
  documentId: PropTypes.string,
  refreshDocumentsTree: PropTypes.func.isRequired,
  setRefreshData: PropTypes.func.isRequired,
};

HistoryTable.defaultProps = {
  documentId: null,
};
