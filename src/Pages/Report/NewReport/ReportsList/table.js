import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { REPORT_SERVICE } from '../../../../utils/Api';
import { reportListMockData } from './mockData';

const ReportsTable = ({ groupId = -1, companyId = -1 }) => {
  const [reportList, setReportList] = useState([]);

  const getUrlToForm = (id) => `${window.location.hash.replace('#', '')}/${id}`;// `/report/predefined_reports/${id}`;

  const columns = () => [
    {
      Header: 'Nazwa raportu',
      accessor: 'reportName',
    },
    {
      Header: 'Opis',
      accessor: 'description',
      filterable: false,
    },
    {
      Header: 'Akcja',
      maxWidth: 150,
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <Link to={getUrlToForm(rowData.row._original.reportGuid)}><Button role="button" color="link">Przejdź</Button></Link>
        </div>
      ),
    },
  ];

  const fetchReportList = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData /* , count: newCount */ } = await getListingData(
      REPORT_SERVICE,
      `/reportgroups/reports/${groupId}&${companyId}`,
      filters,
      page,
      pageSize,
      sort,
      {},
      reportListMockData,
    );
    setReportList(newData);
    // setCount(newCount);
  }, [groupId, companyId]);

  return (
    <>
      <DataTableControlled
        columns={columns()}
        data={reportList}
        filterable
        fetchData={fetchReportList}
        count={reportList.length}
      />
    </>
  );
};

export default ReportsTable;
ReportsTable.propTypes = {
  groupId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
