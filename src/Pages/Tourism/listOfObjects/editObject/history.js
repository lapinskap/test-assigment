import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import HistoryPreview from './historyPreview';
import HistoryTable from './historyTable';

export default function History({ objectId }) {
  const onSave = () => ({});
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const closeEditForm = useCallback(() => {
    setOpenEditPopup(false);
  }, [setOpenEditPopup]);

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      />
      <HistoryTable setOpenEditPopup={setOpenEditPopup} objectId={objectId} />
      {openEditPopup ? <HistoryPreview close={closeEditForm} isOpen={openEditPopup} objectId={objectId} onSave={onSave} /> : null}
    </>
  );
}

History.propTypes = {
  objectId: PropTypes.string.isRequired,
};
