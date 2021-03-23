import React from 'react';
import { Alert } from 'reactstrap';
import Sticky from 'react-stickynode';
import { isMockView } from './index';
import __ from '../Translations';

const ApiWarning = () => (isMockView() ? (
  <Sticky enabled top=".app-header" innerZ="999" activeClass="sticky-active-class">
    <Alert className="mb-0 text-center text-uppercase" color="warning">{__('Wyświetlane dane są danymi testowymi')}</Alert>
  </Sticky>
) : null);

export default ApiWarning;
