import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown,
} from 'reactstrap';
import __ from '../../utils/Translations';
import { downloadFile, getQueryString } from '../../utils/Api';
import SecurityWrapper from '../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';

const MAX_EXPORT_ITEMS = 150000;

const ExportButton = ({
  filters, path, page, pageSize, service, sort, permissions, fileName, handleAdditionalFilters, noResults,
}) => (
  <UncontrolledButtonDropdown size="lg" className="mr-2">
    <SecurityWrapper permission={permissions} disable>
      <DropdownToggle caret color="secondary">
        <span data-t1="export">
          {__('Eksportuj')}
        </span>
      </DropdownToggle>
    </SecurityWrapper>
    <DropdownMenu>
      <DropdownItem
        disabled={noResults}
        onClick={async () => {
          downloadFile(
            service,
            await buildExportPath(
              path,
              filters,
              handleAdditionalFilters,
              sort,
              pageSize,
              page,
            ),
            getFullFileName(fileName, false),
          );
        }}
      >
        <span data-t1="export-page">
          {__('Eksportuj obecną stronę')}
        </span>
      </DropdownItem>
      <DropdownItem
        disabled={filters.length === 0 || noResults}
        onClick={async () => downloadFile(
          service,
          await buildExportPath(
            path,
            filters,
            handleAdditionalFilters,
            sort,
            MAX_EXPORT_ITEMS,
          ),
          getFullFileName(fileName, false),
        )}
      >
        <span data-t1="export-filtered">
          {__('Eksportuj wyfiltrowane')}
        </span>
      </DropdownItem>
      <DropdownItem
        onClick={async () => downloadFile(
          service,
          await buildExportPath(
            path,
            [],
            handleAdditionalFilters,
            sort,
            MAX_EXPORT_ITEMS,
          ),
          getFullFileName(fileName, true),
        )}
      >
        <span data-t1="export-all">
          {__('Eksportuj wszystko')}
        </span>
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledButtonDropdown>
);

const buildExportPath = async (path, filters, handleAdditionalFilters, sort, pageSize, page = null) => {
  const params = { itemsPerPage: pageSize };
  if (page !== null) {
    params.page = page;
  }

  let allFilters = filters || [];
  if (handleAdditionalFilters) {
    const additionalFilter = await handleAdditionalFilters(filters);
    if (additionalFilter) {
      allFilters = [...allFilters, ...additionalFilter];
    }
  }

  allFilters.forEach(({ id, value }) => {
    params[id] = value;
  });
  if (sort) {
    params[`order[${sort.key}]`] = sort.value;
  }
  const queryString = getQueryString(params, false);
  return `${path}${queryString}`;
};

const getFullFileName = (fileName, exportAll) => `export_${exportAll ? 'all_' : ''}${fileName}_${new Date().toLocaleDateString()}.csv`;

export class ExportContext {
  constructor({
    service, path, permission, fileName, handleAdditionalFilters = null,
  }) {
    this.getService = () => service;
    this.getPath = () => path;
    this.getPermission = () => permission;
    this.getFileName = () => fileName;
    this.handleAdditionalFilters = handleAdditionalFilters;
  }
}

ExportButton.propTypes = {
  service: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  sort: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }),
  fileName: PropTypes.string.isRequired,
  noResults: PropTypes.bool,
  permissions: PropTypes.string,
  handleAdditionalFilters: PropTypes.func,
};

ExportButton.defaultProps = {
  permissions: null,
  handleAdditionalFilters: null,
  noResults: false,
  sort: null,
};
export default ExportButton;
