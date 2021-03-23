import React, { useState } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import UserConfirmationPopup from '../../../../Components/UserConfirmationPopup';

const Panel = ({
  reportName, deleteSubscription, canDelete,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState(false);

  const handleDelete = () => {
    setConfirmationPopup(true);
  };

  return (
    <>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-md-8 col-sm-12 configure-report-title">
              Edycja wysyłki
              {' '}
              {reportName}
            </div>
            <div className="col-md-4 col-sm-12 text-right">
              {canDelete && <Button className="mx-1" color="danger" onClick={handleDelete}>Usuń</Button>}
            </div>
          </div>
          <UserConfirmationPopup
            onCancel={() => setConfirmationPopup(false)}
            onConfirm={deleteSubscription}
            isOpen={confirmationPopup}
            title="Usuwanie"
            confirmLabel="Usuń"
            cancelLabel="Anuluj"
            message={`Czy na pewno chcesz usunąć wysyłkę ${reportName}?`}
          />
        </CardBody>
      </Card>
    </>
  );
};

Panel.propTypes = {
  reportName: PropTypes.string.isRequired,
  deleteSubscription: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
};
export default Panel;
