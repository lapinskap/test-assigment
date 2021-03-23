import React from 'react';
import PropTypes from 'prop-types';
import BrowsingHistory from './TabsContent/BrowsingHistory';

export default function RightDrawer({ close }) {
  return (
    <>
      <h3 className="drawer-heading">Recently visited</h3>
      <BrowsingHistory close={close} />
    </>
  );
}
RightDrawer.propTypes = {
  close: PropTypes.func.isRequired,
};
