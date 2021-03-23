import React, { useEffect, useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { dynamicNotification } from '../../../utils/Notifications';
import {
  REPORT_SERVICE, isMockView, restApiRequest,
} from '../../../utils/Api';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';
import { getAhrUrl } from '../helpers/ahrHelper';

const LandingPage = ({ match }) => {
  const { id } = match.params;
  const [archiveId, setArchiveId] = useState({});
  const history = useHistory();
  const rbsContext = useContext(RbsContext);
  const isAhr = rbsContext.userInfo.isAhr();

  useEffect(() => {
    getArchiveReport(id);
  }, [id]);

  useEffect(() => {
    pushToDetailsPage(archiveId, isAhr);
  }, [archiveId, isAhr]);// eslint-disable-line react-hooks/exhaustive-deps

  const pushToDetailsPage = (arch, isA) => {
    if (arch.archiveId) {
      history.push(getAhrUrl(`/report/archive/details/${arch.archiveId}&instantDownload=true`, isA));
    }
  };

  const getArchiveReport = (token) => {
    const endpoint = `/filetokenverify/${token}`;

    fetchData(setArchiveId,
      endpoint,
      REPORT_SERVICE,
      'GET',
      {},
      [],
      'Błąd podczas pobierania pliku z archiwum');
  };

  return (
    <>
      <div>
        <p>{id}</p>
      </div>
    </>
  );
};

export default LandingPage;
LandingPage.propTypes = {
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
