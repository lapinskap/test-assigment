import PropTypes from 'prop-types';
import React, {
  useState, useCallback, useEffect,
} from 'react';
import {
  Row, Col, Card, CardBody, Button, Form,
} from 'reactstrap';

import ReactTable from 'react-table';
import { restApiRequest, isMockView } from '../../utils/Api';
import { dynamicNotification } from '../../utils/Notifications';
import Pagination from './pagination';
import __ from '../../utils/Translations';
import useQueryToState from '../../utils/hooks/useQueryToState';
import ButtonsList from '../ButtonsList';
import AdditionalFilters from './additionalFilters';
import { getRowSelectColumn, MassActionsSelect } from './massActions';
import ApiForbiddenError from '../../utils/Api/ApiForbiddenError';
import { DefaultFilter } from '../DataTable/filters';
import ExportButton, { ExportContext } from './exportButton';

export default function DataTableControlled({
  columns,
  data,
  filterable,
  defaultPageSize,
  exportContext,
  fetchData,
  additionalFilters,
  count,
  buttons,
  getTrProps,
  massActions,
  rowId,
  paramsInUrl,
  id,
}) {
  const [{
    pageSize: initialPageSize, orderKey, orderDir, page: initialPage, ...initialFilters
  }, changeQuery] = useQueryToState();
  const [pageSize, setPageSize] = useState(initialPageSize || defaultPageSize);
  const [hasAccess, setHasAccess] = useState(true);
  const [massActionSelect, setMassActionSelect] = useState({ excluded: [], included: [] });
  const [page, setPage] = useState(+initialPage || 1);
  const [filters, setFilters] = useState(() => Object.keys(initialFilters).map((key) => ({
    id: key,
    value: initialFilters[key],
  })));
  const [sort, setSort] = useState(() => {
    if (orderKey) {
      return {
        key: orderKey,
        value: orderDir || 'asc',
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const updateQuery = useCallback((requestFilters, requestPage, requestPageSize, requestSort) => {
    const params = {};
    requestFilters.forEach(({ id: filterId, value }) => {
      params[filterId] = value;
    });
    if (requestPageSize !== defaultPageSize) {
      params.pageSize = requestPageSize;
    }
    if (requestPage !== 1) {
      params.page = requestPage;
    }
    if (requestSort) {
      params.orderKey = requestSort.key;
      params.orderDir = requestSort.value;
    }
    changeQuery(params);
  }, [changeQuery, defaultPageSize]);
  const updateData = useCallback(async (
    requestFilters, requestPage, requestPageSize, requestSort,
  ) => {
    if (paramsInUrl) {
      updateQuery(requestFilters, requestPage, requestPageSize, requestSort);
    }
    try {
      await fetchData(requestFilters, requestPage, requestPageSize, requestSort);
    } catch (e) {
      if (e instanceof ApiForbiddenError) {
        setHasAccess(false);
      }
    }
    setLoading(false);
  }, [fetchData, updateQuery, paramsInUrl]);

  useEffect(() => {
    setLoading(true);
    updateData(filters, page, pageSize, sort);
    setPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageChange = useCallback((newPage) => {
    if (loading) {
      return;
    }

    setLoading(true);
    updateData(filters, newPage, pageSize, sort);
    setPage(newPage);
  }, [loading, updateData, filters, pageSize, sort]);

  const onFilteredChange = useCallback((newFilters) => {
    if (loading) {
      return;
    }
    setMassActionSelect({ excluded: [], included: [] });
    setFilters(newFilters);
  }, [loading]);

  const filterData = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    const newPage = 1;
    setPage(newPage);
    setLoading(true);
    updateData(
      filters,
      newPage,
      pageSize,
      sort,
    );
  }, [filters, pageSize, loading, updateData, sort]);

  const changeSort = (field) => {
    if (loading) {
      return;
    }

    let sortValue = null;
    if (field && field[0]) {
      sortValue = {
        key: field[0].id,
        value: field[0].desc ? 'desc' : 'asc',
      };
    }
    const newPage = 1;
    setLoading(true);
    updateData(filters, newPage, pageSize, sortValue);
    setSort(sortValue);
    setPage(newPage);
  };

  const updateMassActionSelection = (included, excluded) => {
    setMassActionSelect({ included, excluded });
  };

  const resetFilters = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    const newPage = 1;
    const newFilters = [];
    updateData(newFilters, newPage, pageSize, sort);
    setFilters(newFilters);
    setPage(newPage);
  }, [loading, updateData, pageSize, sort]);

  const onPageSizeChange = useCallback((newPageSize) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const newPage = 1;
    updateData(filters, newPage, newPageSize, sort);
    setPageSize(newPageSize);
    setPage(newPage);
  }, [filters, loading, updateData, sort]);

  const parsedColumns = columns.map((columnData) => {
    const column = { ...columnData };
    column.Header = __(column.Header);
    if (!column.Filter) {
      column.Filter = DefaultFilter;
    }
    return column;
  });

  if (massActions) {
    const pageIds = data.map((item) => item[rowId]);
    parsedColumns.unshift(getRowSelectColumn(rowId, pageIds, massActionSelect.included, massActionSelect.excluded, updateMassActionSelection));
  }
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                filterData();
              }}
              data-t1={id}
            >
              <CardBody>
                {buttons.length || exportContext ? (
                  <div className="listing-btn-container m-2 text-right">
                    {exportContext ? (
                      <ExportButton
                        noResults={count === 0}
                        service={exportContext.getService()}
                        path={exportContext.getPath()}
                        fileName={exportContext.getFileName()}
                        permissions={exportContext.getPermission()}
                        handleAdditionalFilters={exportContext.handleAdditionalFilters}
                        pageSize={pageSize}
                        page={page}
                        filters={filters}
                        sort={sort}
                      />
                    ) : null}
                    <ButtonsList buttons={buttons} />
                  </div>
                ) : null}
                <div className="text-right">
                  <Button
                    data-t1="gridFiltersApply"
                    className="btn-wide mb-2 mr-2 btn-icon btn-icon-right btn-pill"
                    outline
                    color="success"
                    type="submit"
                    onClick={filterData}
                  >
                    Zastosuj filtry
                    <i className="pe-7s-filter btn-icon-wrapper"> </i>
                  </Button>
                  <Button
                    data-t1="gridFiltersClear"
                    className="btn-wide mb-2 mr-2 btn-icon btn-icon-right btn-dashed btn-pill"
                    outline
                    color="danger"
                    onClick={resetFilters}
                  >
                    Resetuj filtry
                    <i className="pe-7s-close btn-icon-wrapper"> </i>
                  </Button>
                </div>
                {additionalFilters ? (
                  <AdditionalFilters
                    currentFilters={filters}
                    onFilteredChange={onFilteredChange}
                    filtersConfig={additionalFilters}
                  />
                ) : null}
                {massActions ? (
                  <MassActionsSelect
                    filters={filters}
                    excluded={massActionSelect.excluded}
                    included={massActionSelect.included}
                    massActions={massActions}
                    count={massActionSelect.included === true ? count - massActionSelect.excluded.length : massActionSelect.included.length}
                  />
                ) : null}
                <div className="text-right">
                  {__('Ilość rekordów')}
                  :
                  {count}
                </div>
                <ReactTable
                  data={data}
                  columns={parsedColumns}
                  className="-striped -highlight"
                  NoDataComponent={() => (
                    <div className="no-table-controlled-records">
                      Nie znaleziono
                      rekordów
                    </div>
                  )}
                  filterable={filterable}
                  loading={loading || !hasAccess}
                  loadingText={hasAccess ? __('Pobieranie danych...') : __('Nie masz dostępu do tego zasobu')}
                  showFilters
                  previousText="Poprzednia"
                  nextText="Następna"
                  page={0}
                  sorted={sort ? [{ id: sort.key, desc: sort.value === 'desc' }] : []}
                  pageSize={pageSize}
                  filtered={filters}
                  minRows={0}
                  defaultFilterMethod={() => data}
                  showPagination={false}
                  onSortedChange={changeSort}
                  onFilteredChange={onFilteredChange}
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
                />
                <Pagination
                  page={page}
                  pageSize={+pageSize}
                  pages={Math.ceil(count / +pageSize)}
                  availablePageSizes={[20, 40, 50, 80, 100]}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              </CardBody>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export const getListingData = async (
  service, path, filters, page, pageSize, sort = null, options = {}, mockData = [],
) => {
  if (isMockView()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockData,
          count: mockData.length,
        });
      }, 100);
    });
  }

  let params = {
    itemsPerPage: pageSize,
    page,
  };
  if (options.params) {
    params = { ...params, ...options.params };
  }
  let headers = {
    accept: 'application/ld+json',
  };
  if (options.headers) {
    headers = { ...headers, ...options.headers };
  }
  const method = options.method ? options.method : 'GET';

  if (filters) {
    const dateFilters = options.dateFilters || [];
    filters.forEach(({ id, value }) => {
      if (dateFilters.includes(id)) {
        if (typeof value === 'object') {
          const { from, to } = value;
          if (from) {
            params[`${id}[after]`] = from.toISOString();
          }
          if (to) {
            params[`${id}[before]`] = to.toISOString();
          }
        }
      } else {
        params[id] = value;
      }
    });
  }
  if (sort) {
    params[`order[${sort.key}]`] = sort.value;
  }
  try {
    const result = await restApiRequest(service, path, method, { params, headers });
    return {
      data: result['hydra:member'] || result.member,
      count: (result.totalItems || result['hydra:totalItems']) ? result['hydra:totalItems'] || result.totalItems : 1,
    };
  } catch (e) {
    if (e instanceof ApiForbiddenError) {
      throw e;
    } else {
      dynamicNotification(e.message, 'error');
    }
    return {
      data: [],
      count: 0,
    };
  }
};

DataTableControlled.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
  })),
  count: PropTypes.number,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  defaultPageSize: PropTypes.number,
  fetchData: PropTypes.func.isRequired,
  getTrProps: PropTypes.func,
  filterable: PropTypes.bool,
  additionalFilters: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.oneOf(['text', 'select']),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
  })),
  rowId: PropTypes.string,
  paramsInUrl: PropTypes.bool,
  exportContext: PropTypes.instanceOf(ExportContext),
  massActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    action: PropTypes.func,
  })),
};

DataTableControlled.defaultProps = {
  data: {},
  buttons: [],
  rowId: 'id',
  massActions: null,
  exportContext: null,
  paramsInUrl: true,
  count: 0,
  defaultPageSize: 20,
  getTrProps: () => ({}),
  filterable: true,
  additionalFilters: null,
};
