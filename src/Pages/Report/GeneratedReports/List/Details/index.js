import React, { useContext, useEffect, useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import {
  REPORT_SERVICE, isMockView, restApiRequest, getServiceHost,
} from '../../../../../utils/Api';
import {
  archiveDetailsMock,
} from '../../mockData';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import { dynamicNotification } from '../../../../../utils/Notifications';
import RbsContext from '../../../../../utils/RoleBasedSecurity/RbsContext';
import { getAhrUrl } from '../../../helpers/ahrHelper';
import Panel from './panel';
import Data from './data';
import { getSession } from '../../../../../utils/RoleBasedSecurity/Session';

const ArchiveDetails = ({ match }) => {
  const [archiveDetails, setArchiveDetails] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const archiveId = match.params.id;
  useEffect(() => {
    fetchArchiveDetails(archiveId);
  }, [archiveId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href);
    const instantDownload = urlParams.get('instantDownload');

    if (instantDownload && archiveDetails) {
      if (instantDownload === 'true' && archiveDetails.archivedReportId) {
        downloadReport();
      }
    }
  }, [archiveDetails]);// eslint-disable-line react-hooks/exhaustive-deps

  const history = useHistory();
  const rbsContext = useContext(RbsContext);
  const isAhr = false;
  const { reportName } = archiveDetails;

  const fetchArchiveDetails = (id) => {
    const endpoint = `/archive/report/details?archivedReportId=${id}`;
    fetchData(setArchiveDetails, endpoint, REPORT_SERVICE, 'GET', {}, archiveDetailsMock, 'Błąd podczas szczegółów z archiwum');
  };

  const deleteArchive = () => {
    fetchData(() => { history.push(getAhrUrl('/report/archive', isAhr)); },
      `/archive/report/file?archivedReportId=${archiveId}`,
      REPORT_SERVICE,
      'Delete',
      { },
      {},
      'Błąd podczas usuwania w archiwum.');
  };

  const downloadReport = async () => {
    if (!isMockView()) {
      setIsDownloading(true);
      // const chosenFormat = formatOptions.find((x) => x.renderFormatId === Number(format));
      const session = getSession();
      const server = getServiceHost(REPORT_SERVICE);
      const url = `${server}/archive/report/file?archivedReportId=${archiveId}"`;

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
              `${archiveDetails.reportName}_${archiveDetails.modificationDate}.${archiveDetails.fileExtension}`);
            // 3. Append to html page
            document.body.appendChild(link);
            // 4. Force download
            link.click();
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);

            setIsDownloading(false);
          } else {
            setIsDownloading(false);
          }
        });// .then(() => callback())
    } else {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <PageTitle
        heading={reportName}
        breadcrumbs={[
          { title: 'Raporty', link: getAhrUrl('/report', isAhr) },
          { title: 'Archiwum', link: getAhrUrl('/report/archive', isAhr) },
        ]}
      />
      <div className="report-detail-margin-bottom">
        <Panel
          isAhr={isAhr}
          reportName={reportName}
          deleteFunc={deleteArchive}
          downloadFunc={downloadReport}
          isDownloading={isDownloading}
          canDelete={archiveDetails.canDelete}
        />
      </div>
      <div className="report-detail-margin-bottom">
        <Data details={archiveDetails} />
      </div>
    </>
  );
};

export default ArchiveDetails;
ArchiveDetails.propTypes = {
  match: matchPropTypes.isRequired,
};

const fetchData = async (updateData, endpoint, service, method, { headers, params }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};
