import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import React from 'react';

const Popup = ({
  id, isOpen, toggle, unmountOnClose, size, className, children,
}) => (
  <Modal isOpen={isOpen} toggle={toggle} unmountOnClose={unmountOnClose} size={size} className={className}>
    <div data-t1={id}>
      {children}
    </div>
  </Modal>
);

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  unmountOnClose: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
};

Popup.defaultProps = {
  isOpen: true,
  unmountOnClose: true,
  size: undefined,
  className: undefined,
};

export default Popup;
