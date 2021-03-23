/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Card, CardBody, Row, Col, ListGroup, CardTitle,
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

export default function CustomDropzone({
  onDrop, files, clearFiles, noCards,
}) {
  return noCards ? (
    <Row className="mt-3">
      <Col md="12">
        <CardTitle>Wybierz zdjęcie</CardTitle>
        <Row>
          <Col md="8">
            <div className="dropzone-wrapper dropzone-wrapper-lg">
              <Dropzone
                onDrop={(dropedFiles) => {
                  onDrop(dropedFiles);
                }}
                onFileDialogCancel={() => clearFiles([])}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                      <p>
                        Upuść tutaj kilka plików lub kliknij, aby wybrać pliki do przesłania.
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          </Col>
          <Col md="4">
            <b className="mb-2 d-block">Wybrane pliki</b>
            <ListGroup>{files.map((file) => <p>{file.name}</p>)}</ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  ) : (
    <Row key="test1">
      <Col md="12">
        <Card className="main-card mb-3">
          <CardBody>
            <CardTitle>Wybierz zdjęcie</CardTitle>
            <Row>
              <Col md="8">
                <div className="dropzone-wrapper dropzone-wrapper-lg">
                  <Dropzone
                    onDrop={(dropedFiles) => {
                      onDrop(dropedFiles);
                    }}
                    onFileDialogCancel={() => clearFiles([])}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                          <p>
                            Upuść tutaj kilka plików lub kliknij, aby wybrać pliki do przesłania.
                          </p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>
              </Col>
              <Col md="4">
                <b className="mb-2 d-block">Wybrane pliki</b>
                <ListGroup>{files.map((file) => <p>{file.name}</p>)}</ListGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

CustomDropzone.propTypes = {
  noCards: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,

  })).isRequired,
  onDrop: PropTypes.func.isRequired,
  clearFiles: PropTypes.func.isRequired,
};

CustomDropzone.defaultProps = {
  noCards: false,
};
