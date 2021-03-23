import React from 'react';
import PropTypes from 'prop-types';

export default function RightDrawer({ close }) {
  return (
    <>
      <h3 className="drawer-heading">Quick menu</h3>
    </>
  );
}
RightDrawer.propTypes = {
  close: PropTypes.func.isRequired,
};
