import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import Popup from '../Popup/popup';

export default function UserConfirmationPopup(
  {
    onCancel,
    onConfirm,
    isOpen,
    title,
    confirmLabel,
    cancelLabel,
    message,
  },
) {
  return (
    <Popup id="confirmation" isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button data-t1="cancel" color="light" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button data-t1="confirm" color="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Popup>
  );
}

/**
 * Used by Browser router
 * @param message
 * @param callback
 * @param title
 */
export function getUserConfirmationPopup(message, callback, title = 'Czy na pewno chcesz opuścić tę stronę?') {
  if (!message) {
    callback(true);
    return;
  }
  const container = document.createElement('div');
  container.setAttribute('custom-confirmation-navigation', '');
  document.body.appendChild(container);
  const closeModal = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(callbackState);
  };
  ReactDOM.render(
    <UserConfirmationPopup
      title={title}
      onCancel={() => closeModal(false)}
      onConfirm={() => closeModal(true)}
      message={message}
    />,
    container,
  );
}

UserConfirmationPopup.propTypes = {
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  isOpen: PropTypes.bool,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
};

UserConfirmationPopup.defaultProps = {
  cancelLabel: 'Nie',
  confirmLabel: 'Tak',
  isOpen: true,
  message: 'Czy na pewno chcesz wykonać tę operację?',
  title: 'Czy jesteś pewien?',
};
