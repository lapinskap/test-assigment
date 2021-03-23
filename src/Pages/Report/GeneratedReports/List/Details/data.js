import React from 'react';
import {
  Card, CardBody, CardTitle, Col, Row, Input, Form, FormGroup, Label,
} from 'reactstrap';
import PropTypes from 'prop-types';

const Data = ({
  details, isAhr,
}) => {
  const renderParameters = () => {
    if (details.parameters) {
      return details.parameters.map((p) => (
        <FormGroup key={p.label}>
          <Label for={p.label}>{p.label}</Label>
          {renderValues(p.values, p.label)}
        </FormGroup>
      ));
    }
    return '';
  };

  const renderValues = (parameter, name) => parameter.map((p) => <Input key={p.value} type="text" name={name} disabled value={p.value} />);

  return (
    <>
      <Row>
        <Col lg="6">
          <Card>
            <CardBody>
              <CardTitle>
                Podstawowe dane
                <hr />
              </CardTitle>
              <Form>
                <FormGroup>
                  <Label for="reportGroup">Grupa</Label>
                  <Input type="text" name="reportGroups" disabled value={details.reportGroup} />
                </FormGroup>
                <FormGroup>
                  <Label for="reportName">Nazwa raportu</Label>
                  <Input type="text" name="reportName" value={details.reportName} disabled />
                </FormGroup>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <Label for="saveDate">Data zapisania</Label>
                      <Input type="text" name="saveDate" value={details.modificationDateStr} disabled />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <Label for="reportFormat">Format</Label>
                      <Input type="text" name="reportFormat" value={details.fileExtension} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="source">Źródło</Label>
                  <Input type="text" name="source" value={details.sourceName} disabled />
                </FormGroup>
                <FormGroup>
                  <Label for="createdBy">Utworzone przez</Label>
                  <Input type="text" name="createdBy" value={details.creator} disabled />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card>
            <CardBody>
              <CardTitle>
                Parametry raportu
                <hr />
              </CardTitle>
              <Form>
                {renderParameters()}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

Data.propTypes = {
  isAhr: PropTypes.bool.isRequired,
  details: PropTypes.objectOf.isRequired,
};
export default Data;
