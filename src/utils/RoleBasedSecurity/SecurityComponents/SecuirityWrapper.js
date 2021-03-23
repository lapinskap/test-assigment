import PropTypes from 'prop-types';
import React from 'react';
import useHasPermission from '../../hooks/security/useHasPermission';
import __ from '../../Translations';

const SecurityWrapper = ({ permission, children, disable }) => {
  const hasPermissions = useHasPermission(permission);
  if (!hasPermissions) {
    if (disable) {
      return (
        <div className="disabled-area-wrapper" title={__('Nie masz uprawnień ({0})', [permission])}>
          <div className="not-allowed disabled-area" />
          {children}
        </div>
      );
    }
    return null;
  }

  return children;
};

export default SecurityWrapper;

SecurityWrapper.propTypes = {
  permission: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  disable: PropTypes.bool,
};

SecurityWrapper.defaultProps = {
  disable: false,
};
