/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Modal, ModalBody, ModalHeader, ModalFooter, Button, Alert, Label,
} from 'reactstrap';
import PropTypes from 'prop-types';

export default function ParametersModal({ isOpen, close, parameters }) {
  const renderParams = () => parameters.map((item) => (
    <li key={item.label}>
      {item.label}
      {': '}
      {item.values.map((v) => `${v.value}, `)}
    </li>
  ));

  return (
    <Modal isOpen={isOpen} toggle={close} unmountOnClose size="sm">
      <ModalHeader toggle={close}>Parametry</ModalHeader>
      <ModalBody>
        <ul>
          {renderParams()}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={close}>Wróć</Button>
      </ModalFooter>
    </Modal>
  );
}

ParametersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  parameters: PropTypes.arrayOf.isRequired,
};
