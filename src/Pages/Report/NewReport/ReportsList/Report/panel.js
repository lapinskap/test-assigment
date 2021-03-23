import React, { useState } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import DownloadPopup from './downloadPopup';
import { getAhrUrl } from '../../../helpers/ahrHelper';

const Panel = ({
  fetchFormatOptions, showReport, download, formatOptions, reportName, isGetBlockBtn, isAhr,
}) => {
  const history = useHistory();
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [format, setFromat] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const closeDownloadReportPopup = () => setIsDownloadPopupOpen(false);
  const openDownloadReportPopup = () => {
    setIsAlert(false);
    fetchFormatOptions();
    setIsDownloadPopupOpen(true);
  };

  const backToPreviousSite = () => {
    history.goBack();
  };

  const handleClickListBtn = () => {
    const url = '/report/subscriptions';// ?reportName=${reportName}`;

    history.push(getAhrUrl(url, isAhr));
  };

  const saveReport = (toArchive) => {
    const callback = (result) => {
      if (result) {
        setIsSaving(false);
        setIsDownloadPopupOpen(false);
      } else {
        setIsSaving(false);
        setIsAlert(true);
      }
    };

    if (format !== '-1' && format !== '') {
      setIsAlert(false);
      setIsSaving(true);
      download(format, callback, toArchive);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-md-4 col-sm-12 configure-report-title">
              Konfiguracja raportu
            </div>
            <div className="col-md-8 col-sm-12 text-right">
              <Button className="mx-1" color="secondary" onClick={backToPreviousSite}>Wróć</Button>
              <Button className="mx-1" color="primary" onClick={handleClickListBtn}>Lista wysyłek dla raportu</Button>
              <Button className="mx-1" color="primary" onClick={() => showReport(1)} disabled={isGetBlockBtn}>Podgląd</Button>
              <Button className="mx-1" color="success" onClick={openDownloadReportPopup} disabled={isGetBlockBtn}>Pobierz</Button>
            </div>
          </div>
          <DownloadPopup
            isOpen={isDownloadPopupOpen}
            close={closeDownloadReportPopup}
            isSaving={isSaving}
            save={saveReport}
            onChangeSelect={(e) => {
              setFromat(e.target.value);
            }}
            formatOptions={formatOptions}
            alert={isAlert}
          />
        </CardBody>
      </Card>
    </>
  );
};

Panel.propTypes = {
  fetchFormatOptions: PropTypes.func.isRequired,
  showReport: PropTypes.func.isRequired,
  formatOptions: PropTypes.arrayOf.isRequired,
  download: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
  isGetBlockBtn: PropTypes.bool.isRequired,
  isAhr: PropTypes.bool.isRequired,
};
export default Panel;
