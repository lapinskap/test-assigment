import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'reactstrap';
import __ from '../../utils/Translations';

const NoAccessPage = ({ logout }) => (
  <div className="p-3">
    <Alert color="danger">
      {__('Nie masz uprawnień do oglądania tej strony.')}
      <Button color="link" onClick={logout}>{__('Wyloguj')}</Button>
    </Alert>
  </div>
);

NoAccessPage.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default NoAccessPage;
