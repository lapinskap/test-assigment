import React from 'react';
import PropTypes from 'prop-types';
import PopupComponent from '../../../../../../../Components/Popup/popup';
import {
  POPUP_TYPE_BLOCK,
  POPUP_TYPE_CANCEL, POPUP_TYPE_CHANGE, POPUP_TYPE_RESIGN, POPUP_TYPE_SUSPEND,
} from '../utils';
import Cancel from './cancel';
import Suspend from './suspend';
import Resign from './resign';
import Change from './change';
import Block from './block';

export default function Popup({
  close, subscription, type,
}) {
  let content = null;
  if (type === POPUP_TYPE_SUSPEND) {
    content = <Suspend subscription={subscription} close={close} />;
  } else if (type === POPUP_TYPE_CHANGE) {
    content = <Change subscription={subscription} close={close} />;
  } else if (type === POPUP_TYPE_RESIGN) {
    content = <Resign subscription={subscription} close={close} />;
  } else if (type === POPUP_TYPE_CANCEL) {
    content = <Cancel subscription={subscription} close={close} />;
  } else if (type === POPUP_TYPE_BLOCK) {
    content = <Block subscription={subscription} close={close} />;
  }

  if (!content) {
    return null;
  }

  return (
    <PopupComponent id={`${type}Popup`} isOpen toggle={() => close()} unmountOnClose size="lg">
      {content}
    </PopupComponent>
  );
}

Popup.propTypes = {
  close: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  subscription: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};
