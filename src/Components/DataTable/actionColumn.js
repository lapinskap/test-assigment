import React from 'react';
import PropTypes from 'prop-types';
import RbsButton from '../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import __ from '../../utils/Translations';

export default function ActionColumn({ buttons, rowId, data }) {
  return buttons
    .filter(Boolean)
    .map(
      (
        {
          id,
          size = null,
          color = 'link',
          className = '',
          onClick = () => {},
          label = __('Edytuj'),
          type = 'button',
          disabled = false,
          href,
          target,
          permission,
          title = label,
        },
      ) => (
        <RbsButton
          key={id}
          data-t1={`rowAction-${id}`}
          data-t2={data[rowId]}
          size={size}
          color={color}
          type={type}
          permission={permission}
          className={className}
          disabled={disabled}
          onClick={onClick}
          target={target}
          title={title}
          href={href ? `#${href}` : null}
        >
          {label}
        </RbsButton>
      ),
    );
}

ActionColumn.propTypes = {
  rowId: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    size: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    permission: PropTypes.string,
    onClick: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    href: PropTypes.string,
    target: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
};

ActionColumn.defaultProps = {
  rowId: 'id',
};
