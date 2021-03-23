import React from 'react';
import PropTypes from 'prop-types';
import TooltipWrapper from '../Tooltips/tooltipWrapper';
import RbsButton from '../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';

export default function ButtonsList({ buttons }) {
  return buttons
    .filter(Boolean)
    .map(
      (
        {
          id = '',
          size = 'lg',
          color = 'primary',
          className = 'mr-2',
          onClick = () => {
          },
          text = 'Zapisz',
          type = 'button',
          disabled = false,
          tooltip,
          href,
          permission,
          title = text,
        },
        key,
      ) => {
        const button = (
          <RbsButton
            /* eslint-disable-next-line react/no-array-index-key */
            key={id || key}
            data-t1={id}
            size={size}
            color={color}
            type={type}
            permission={permission}
            className={className}
            disabled={disabled}
            onClick={onClick}
            title={title}
            href={href ? `#${href}` : null}
          >
            {text}
          </RbsButton>
        );
        return tooltip ? (
          <TooltipWrapper
            key={`button-list-tooltip-${id}`}
            content={tooltip}
            id={`button-list-tooltip-${key}`}
          >
            {button}
          </TooltipWrapper>
        ) : button;
      },
    );
}

ButtonsList.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    permission: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    href: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
};
