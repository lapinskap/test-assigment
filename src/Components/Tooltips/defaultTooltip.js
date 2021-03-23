import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Tooltip,
} from 'reactstrap';

const getIcon = (type, id) => {
  switch (type) {
    case 'legacy':
      return <i id={id} className="pe-7s-help1 text-danger font-weight-bold" />;
    case 'info':
    default:
      return <i id={id} className="pe-7s-help1 text-primary font-weight-bold" />;
  }
};

export default function DefaultTooltip({
  type, content, placement, id,
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const validId = id.replace(/\//g, '');
  const icon = getIcon(type, validId);
  return (
    <>
      {icon}
      <Tooltip target={validId} placement={placement} isOpen={tooltipOpen} toggle={toggle} innerClassName="tooltip-max-width">
        {content}
      </Tooltip>
    </>
  );
}

DefaultTooltip.propTypes = {
  content: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string,
  type: PropTypes.string,
};

DefaultTooltip.defaultProps = {
  placement: 'auto',
  type: 'info',
};
