import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Panel = ({
  isAhr, reportName, deleteFunc, downloadFunc, isDownloading, canDelete,
}) => {
  const history = useHistory();

  const backToPreviousSite = () => {
    history.goBack();
  };

  const downloadButton = isDownloading ? (
    <Button color="success" onClick={downloadFunc} disabled>
      <FontAwesomeIcon icon={faSpinner} spin />
      {' '}
      Pobieranie...
    </Button>
  )
    : <Button color="success" onClick={downloadFunc}>Pobierz</Button>;

  return (
    <>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-md-4 col-sm-12 configure-report-title">
              Raport:
              {' '}
              {reportName}
            </div>
            <div className="col-md-8 col-sm-12 text-right">
              <Button className="mx-1" color="secondary" onClick={backToPreviousSite}>Wróć</Button>
              {canDelete && <Button className="mx-1" color="danger" onClick={deleteFunc}>Usuń</Button>}
              {downloadButton}
              {/* <Button className="mx-1" color="success" onClick={downloadFunc} disabled={isDownloading}>Pobierz</Button> */}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

Panel.propTypes = {
  isAhr: PropTypes.bool.isRequired,
  reportName: PropTypes.string.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  downloadFunc: PropTypes.func.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
};
export default Panel;
