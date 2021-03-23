import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { SelectFilter } from '../../../../Components/DataTable/filters';
import {
  REPORT_SERVICE, isMockView, restApiRequest, getServiceHost,
} from '../../../../utils/Api';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import {
  ArchiveListMock, groupFilterMock, formatFilterMock, sourceFilterMock, // creatorFilterMock,
} from '../mockData';
// import UserConfirmationPopup from '../../../../Components/UserConfirmationPopup';
import ParametersModal from './parametersModal';
import { companySelectMockData } from '../../NewReport/ReportsList/mockData';
import { dynamicNotification } from '../../../../utils/Notifications';
import { getAhrUrl } from '../../helpers/ahrHelper';
import CompanySelect from '../../NewReport/ReportsList/companySelect';
import { getSession } from '../../../../utils/RoleBasedSecurity/Session';

const Archive = ({ isAhr }) => {
  const [archiveList, setArchiveList] = useState([]);
  const [archiveListListCount, setArchiveListListCount] = useState(0);

  const [companySelectList, setCompanySelectList] = useState([]);
  const [selectCompany, setSelectCompany] = useState('-1');

  const [paramsModalOpen, setParamsModalOpen] = useState(false);
  const [paramsModal, setParamsModal] = useState([]);

  const [reportGroupFilter, setReportGroupFilter] = useState([]);
  const [formatFilter, setFormatFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);

  useEffect(() => {
    fetchCompanySelectData();

    fetchReportGroupFilter();
    fetchFormatFilter();
    fetchSourceFilter();
  }, []);

  const fetchReportGroupFilter = () => {
    fetchData(setReportGroupFilter,
      '/dropdown/reportgroups',
      REPORT_SERVICE,
      'GET',
      {},
      groupFilterMock,
      'Błąd podczas pobierania listy dostępnych grup raportów');
  };
  const fetchFormatFilter = () => {
    fetchData(setFormatFilter,
      '/dropdown/reportextensions',
      REPORT_SERVICE,
      'GET',
      {},
      formatFilterMock,
      'Błąd podczas pobierania listy dostępnych formatów');
  };
  const fetchSourceFilter = () => {
    fetchData(setSourceFilter,
      '/dropdown/archivedreportsources',
      REPORT_SERVICE,
      'GET',
      {},
      sourceFilterMock,
      'Błąd podczas pobierania listy dostępnych źródeł');
  };
  // const fetchCreatorFilter = () => {
  //   fetchData(setCreatorFilter,
  //     '/dropdown/format',
  //     REPORT_SERVICE,
  //     'GET',
  //     {},
  //     creatorFilterMock,
  //     'Błąd podczas pobierania listy dostępnych twórców');
  // };

  const columns = () => [
    {
      Header: 'Grupa',
      accessor: 'reportGroup',
      Filter: SelectFilter(reportGroupFilter),
      Cell: mapValueFromOptions([], 'reportGroup'),
    },
    {
      Header: 'Nazwa',
      accessor: 'reportName',
    },
    {
      Header: 'Data Zapisania',
      accessor: 'modificationDateStr',
    },
    {
      Header: 'Parametry',
      accessor: 'parameters',
      filterable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <Button role="button" color="link" onClick={() => handleParamsClick(rowData.row._original.parameters)}>Pokaż</Button>
        </div>
      ),
    },
    {
      Header: 'Format',
      accessor: 'fileExtension',
      Filter: SelectFilter(formatFilter),
      Cell: mapValueFromOptions([], 'fileExtension'),
    },
    {
      Header: 'Źródło',
      accessor: 'sourceName',
      Filter: SelectFilter(sourceFilter),
      Cell: mapValueFromOptions([], 'sourceName'),
    },
    {
      Header: 'Utworzone przez',
      accessor: 'creator',
    },
    {
      Header: 'Akcja',
      maxWidth: 150,
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <Button
            role="button"
            onClick={() => downloadReport(rowData.row._original)}
            color="link"
          >
            Pobierz
          </Button>
          <Link to={archiveDetailsUrl(rowData.row._original.archivedReportId)}><Button role="button" color="link">Więcej</Button></Link>
        </div>
      ),
    },
  ];

  const handleParamsClick = (params) => {
    setParamsModal(params);
    setParamsModalOpen(true);
  };

  const archiveDetailsUrl = (id) => getAhrUrl(`/report/archive/details/${id}`, isAhr);

  const fetchArchiveList = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      REPORT_SERVICE,
      `/archive/reports/${selectCompany}`,
      filters,
      page,
      pageSize,
      sort,
      {},
      ArchiveListMock,
    );
    setArchiveList(newData);
    setArchiveListListCount(newCount);
  }, [selectCompany]);

  const fetchCompanySelectData = () => {
    const setCompanyList = (data) => {
      const array = [];

      array.push({ label: 'Nie wybrano', vlaue: '-1' });

      data.map((d) => array.push(d));

      setCompanySelectList(array);
    };

    fetchData(setCompanyList,
      '/reportgroups/companies',
      REPORT_SERVICE,
      {},
      companySelectMockData,
      'Błąd podczas pobierania firm');
  };

  const downloadReport = async (data) => {
    if (!isMockView()) {
      // const chosenFormat = formatOptions.find((x) => x.renderFormatId === Number(format));
      const session = getSession();
      const server = getServiceHost(REPORT_SERVICE);
      const url = `${server}/archive/report/file?archivedReportId=${data.archivedReportId}"`;

      fetch(url,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            Authorization: `Bearer ${await session.getValidAccessToken()}`,
          },

          // 1. Convert the data into 'blob'
        })
        .then((response) => response.blob()).then((blob) => {
          if (blob.size !== 0) {
            // 2. Create blob link to download
            const urlfile = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = urlfile;
            link.setAttribute('download',
              `${data.reportName}_${data.modificationDate}.${data.fileExtension}`);
            // 3. Append to html page
            document.body.appendChild(link);
            // 4. Force download
            link.click();
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);
          }
        });// .then(() => callback())
    }
  };

  return (
    <>
      <CompanySelect companies={companySelectList} selectCompany={setSelectCompany} />
      <DataTableControlled
        key={selectCompany}
        columns={columns()}
        data={archiveList}
        filterable
        fetchData={fetchArchiveList}
        count={archiveListListCount}
      />
      <ParametersModal isOpen={paramsModalOpen} close={() => setParamsModalOpen(false)} parameters={paramsModal} />
    </>
  );
};

export default Archive;
Archive.propTypes = {
  isAhr: PropTypes.bool.isRequired,
};

const fetchData = async (updateData, endpoint, service, { headers, params }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, 'GET', { headers, params }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};
