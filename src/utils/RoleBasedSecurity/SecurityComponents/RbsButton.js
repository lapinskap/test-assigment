import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import React from 'react';
import __ from '../../Translations';
import useHasPermission from '../../hooks/security/useHasPermission';

const RbsButton = ({
  permission, children, className, disabled, title, ...props
}) => {
  let buttonDisabled = disabled;
  let buttonClassName = buttonDisabled ? `${className} enable-pointer-event` : className;
  let buttonTitle = title;
  const hasPermissions = useHasPermission(permission);
  if (permission && !hasPermissions) {
    buttonDisabled = true;
    buttonTitle = __('Nie masz uprawnień ({0})', [permission]);
    buttonClassName = buttonClassName ? `${buttonClassName} not-allowed` : 'not-allowed';
  }

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <Button {...props} disabled={buttonDisabled} className={buttonClassName} title={buttonTitle}>
      {children}
    </Button>
  );
};

export default RbsButton;

RbsButton.propTypes = {
  className: PropTypes.string,
  permission: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

RbsButton.defaultProps = {
  permission: '',
  title: null,
  className: null,
  disabled: false,
};
