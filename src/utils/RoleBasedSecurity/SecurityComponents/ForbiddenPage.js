import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'reactstrap';
import __ from '../../Translations';

const ForbiddenPage = ({ permission }) => (
  <Alert color="danger">
    {__('Nie masz uprawnień do oglądania tej strony. Brakujące pozwolenie: ({0})', [permission])}
  </Alert>
);

export default ForbiddenPage;

ForbiddenPage.propTypes = {
  permission: PropTypes.string,
};

ForbiddenPage.defaultProps = {
  permission: '',
};
