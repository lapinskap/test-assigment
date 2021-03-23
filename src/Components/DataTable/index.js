import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Row, Col, Card, CardBody,
} from 'reactstrap';

import ReactTable from 'react-table';
import __ from '../../utils/Translations';
import ButtonsList from '../ButtonsList';
import { getRowSelectColumn, MassActionsSelect } from '../DataTableControlled/massActions';
import { DefaultFilter, defaultFilterMethod } from './filters';
import Pagination from '../DataTableControlled/pagination';
import ExportButton, { ExportContext } from '../DataTableControlled/exportButton';

export default function DateTable({
  columns,
  id,
  data,
  filterable,
  defaultPageSize,
  showPagination,
  noCards,
  buttons,
  sortable,
  rowId,
  exportContext,
  massActions,
  getTrProps,
  className,
  defaultFilters,
  defaultSorted,
}) {
  const [filters, setFilters] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [currentPageSize, setPageSize] = useState(showPagination ? defaultPageSize : data.length);
  const [currentPage, setPage] = useState(1);
  const [currentSort, setSort] = useState(null);

  const [massActionSelect, setMassActionSelect] = useState({
    excluded: [],
    included: [],
  });

  const updateMassActionSelection = (included, excluded) => {
    setMassActionSelect({
      included,
      excluded,
    });
  };

  const parsedColumns = columns.map((columnData) => {
    const column = { ...columnData };
    column.Header = __(column.Header);
    if (!column.Filter) {
      column.Filter = DefaultFilter;
    }
    return column;
  });

  if (massActions) {
    const pageIds = data.slice(currentPage * currentPageSize, (currentPage * currentPageSize) + currentPageSize)
      .map((item) => item[rowId]);
    parsedColumns.unshift(getRowSelectColumn(rowId, pageIds, massActionSelect.included, massActionSelect.excluded, updateMassActionSelection));
  }
  const table = (
    <>
      <div className="text-right">
        {__('Ilość rekordów')}
        :
        {dataCount || 0}
      </div>
      <ReactTable
        key={data.length}
        defaultSorted={defaultSorted}
        data={data}
        defaultFilterMethod={defaultFilterMethod}
        NoDataComponent={() => <div className="no-table-records">Nie znaleziono rekordów</div>}
        columns={parsedColumns}
        defaultFiltered={defaultFilters}
        defaultPageSize={showPagination ? defaultPageSize : data.length}
        className={`-striped -highlight text-center ${className}`}
        filterable={filterable}
        previousText={__('Poprzednia')}
        nextText={__('Następna')}
        pageText={__('Strona')}
        ofText={__('z')}
        rowsText={__('wpisów')}
        sortable={sortable}
        minRows={0}
        page={currentPage - 1}
        pageSize={+currentPageSize}
        showPagination={false}
        getTheadThProps={(a, b, column) => (column.sortable !== false ? {
          'data-t1': 'gridSort',
          'data-t2': column.id,
        } : {})}
        getTrProps={(state, row) => ({
          'data-t1': 'gridRow',
          'data-t2': row?.original[rowId],
          ...getTrProps(state, row),
        })}
        getTdProps={(state, row, column) => ({
          'data-t1': 'gridCell',
          'data-t2': column.id,
        })}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={((newPageSize) => setPageSize(newPageSize))}
        onFetchData={(state) => {
          state.onPageChange(1);
          setDataCount(state.sortedData.length);
        }}
        onFilteredChange={((newFilters) => {
          setMassActionSelect({
            excluded: [],
            included: [],
          });
          setFilters(newFilters);
        })}
        onSortedChange={((field) => {
          let sortValue = null;
          if (field && field[0]) {
            sortValue = {
              key: field[0].id,
              value: field[0].desc ? 'desc' : 'asc',
            };
          }
          setSort(sortValue);
        })}
      />
      {showPagination ? (
        <Pagination
          page={+currentPage}
          pageSize={currentPageSize}
          pages={Math.ceil(dataCount / currentPageSize)}
          availablePageSizes={[5, 10, 20, 40, 50, 80, 100]}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}
    </>
  );
  const tableButtons = (buttons.length ? (
    <div className="listing-btn-container m-2 text-right">
      {exportContext ? (
        <ExportButton
          noResults={dataCount === 0}
          service={exportContext.getService()}
          path={exportContext.getPath()}
          fileName={exportContext.getFileName()}
          permissions={exportContext.getPermission()}
          handleAdditionalFilters={exportContext.handleAdditionalFilters}
          pageSize={currentPageSize}
          page={currentPage}
          filters={filters}
          sort={currentSort}
        />
      ) : null}
      <ButtonsList buttons={buttons} />
    </div>
  ) : null);

  const tableMassActions = massActions ? (
    <MassActionsSelect
      filters={filters}
      excluded={massActionSelect.excluded}
      included={massActionSelect.included}
      massActions={massActions}
      count={massActionSelect.included === true ? data.length - massActionSelect.excluded.length : massActionSelect.included.length}
    />
  ) : null;

  return noCards ? (
    <div data-t1={id}>
      {tableButtons}
      {tableMassActions}
      {table}
    </div>
  ) : (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody data-t1={id}>
              {tableButtons}
              {tableMassActions}
              {table}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

DateTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
  className: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
  })),
  defaultPageSize: PropTypes.number,
  filterable: PropTypes.bool,
  showPagination: PropTypes.bool,
  getTrProps: PropTypes.func,
  noCards: PropTypes.bool,
  sortable: PropTypes.bool,
  rowId: PropTypes.string,
  massActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    action: PropTypes.func,
  })),
  id: PropTypes.string.isRequired,
  defaultFilters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
  })),
  exportContext: PropTypes.instanceOf(ExportContext),
  defaultSorted: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    desc: PropTypes.bool,
  })),
};

DateTable.defaultProps = {
  data: [],
  buttons: [],
  defaultPageSize: 10,
  filterable: false,
  defaultSorted: [],
  defaultFilters: [],
  getTrProps: () => ({}),
  showPagination: true,
  sortable: true,
  noCards: false,
  rowId: 'id',
  massActions: null,
  exportContext: null,
  className: '',
};
