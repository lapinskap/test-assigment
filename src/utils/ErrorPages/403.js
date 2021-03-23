import React from 'react';
import { Row, Col } from 'reactstrap';
import __ from '../Translations';

export default function ForbiddenErrorPage() {
  return (
    <Row className="vh-100">
      <Col className="my-auto">
        <div className="text-center ">
          <i className="pe-7s-attention icon-gradient bg-plum-plate error-page-icon" />
          <div>{__('Nie masz dostępu do tego zasobu')}</div>
        </div>
      </Col>
    </Row>
  );
}
