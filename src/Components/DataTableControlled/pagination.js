import PropTypes from 'prop-types';
import React from 'react';

export default function Pagination({
  page, pageSize, pages, availablePageSizes, onPageChange, onPageSizeChange,
}) {
  return (
    <div className="ReactTable">
      <div className="pagination">
        <div className="pagination-bottom w-100">
          <div className="-pagination">
            <div className="-previous">
              <button
                data-t1="gridPreviousPage"
                type="button"
                disabled={page < 2}
                className="-btn"
                onClick={() => onPageChange(page - 1)}
              >
                Poprzednia
              </button>
            </div>
            <div className="-center">
              <span className="-pageInfo">
                Strona
                <div className="-pageJump">
                  <input
                    data-t1="gridPage"
                    aria-label="jump to page"
                    type="text"
                    value={page}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (value >= 1 && value <= pages) {
                        onPageChange(value);
                      }
                    }}
                  />
                </div>
                z
                <span className="-totalPages">{pages === 0 ? 1 : pages}</span>
              </span>
              <span className="select-wrap -pageSizeOptions">
                <select
                  data-t1="gridPageSize"
                  aria-label="rows per page"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(e.target.value)}
                >
                  {availablePageSizes.map((el) => (
                    <option key={el} value={el}>
                      {el}
                      {' '}
                      wpisów
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div className="-next">
              <button
                data-t1="gridNextPage"
                type="button"
                className="-btn"
                disabled={page >= pages}
                onClick={() => onPageChange(+page + 1)}
              >
                Następna
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  availablePageSizes: PropTypes.arrayOf(PropTypes.number).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  page: 1,
};
