/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Modal, ModalBody, ModalHeader, ModalFooter, Button, Alert, Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import ToggleSwitch from '../../../../../Components/FormElements/ToggleSwitch';

export default function DownloadPopup({
  isOpen, close, isSaving, save, onChangeSelect, formatOptions, alert,
}) {
  const saveButton = isSaving ? (
    <Button color="success" onClick={() => save(toArchive)} disabled>
      <FontAwesomeIcon icon={faSpinner} spin />
      {' '}
      Pobieranie...
    </Button>
  )
    : <Button color="success" onClick={() => save(toArchive)}>Pobierz</Button>;

  const getFormatOptions = () => formatOptions
    .map((item) => <option key={item.renderFormatId} value={item.renderFormatId}>{item.renderFormatName}</option>);

  const [toArchive, setToArchive] = useState(false);

  return (
    <Modal isOpen={isOpen} toggle={close} unmountOnClose size="md">
      <ModalHeader toggle={close}>Pobierz raport</ModalHeader>
      <ModalBody>
        {alert && (
          <Alert color="danger">
            Błąd! zlecono do wysyłki mailowej.
          </Alert>
        )}
        <div className="form-group">
          <Label for="file-format">Wybierz format pliku*</Label>
          <select id="file-format" className="form-control" defaultValue="-1" onChange={onChangeSelect}>
            <option value="-1" disabled hidden>---Nie Wybrano---</option>
            {getFormatOptions()}
          </select>
        </div>
        <ToggleSwitch
          handleChange={(isOn) => setToArchive(isOn)}
          checked={toArchive}
          label="Dodać raport do archiwum"
        />
      </ModalBody>
      <ModalFooter>
        {saveButton}
      </ModalFooter>
    </Modal>
  );
}

DownloadPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
  onChangeSelect: PropTypes.func.isRequired,
  formatOptions: PropTypes.arrayOf.isRequired,
  alert: PropTypes.bool.isRequired,
};
