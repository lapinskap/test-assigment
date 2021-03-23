import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Tooltip,
} from 'reactstrap';

export default function TooltipWrapper({
  content, placement, id, children,
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <span id={id}>{children}</span>
      <Tooltip target={id} placement={placement} isOpen={tooltipOpen} toggle={toggle} innerClassName="tooltip-max-width">
        {content}
      </Tooltip>
    </>
  );
}

TooltipWrapper.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
};

TooltipWrapper.defaultProps = {
  placement: 'auto',
};
