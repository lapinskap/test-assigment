import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Alert, CardBody, CardHeader, Table, Card, Button,
} from 'reactstrap';
import Form from '../../../../Components/Form';
import __ from '../../../../utils/Translations';

export default function ImportForm({
  additionalFields = [], submitMethod, instruction, legend, csvForm, title, importMessages, setImportMessages,
}) {
  const [data, updateData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setImportMessages([]);
  };

  const fields = [
    {
      id: 'file',
      type: 'file',
      label: 'Plik CSV',
      validation: ['required', { method: 'allowedExtensions', args: [['csv']] }],
    },
    ...additionalFields,
    {
      key: 'submitButton',
      component: <Button data-t1="import" key="import-submit" disabled={isProcessing} type="submit">Importuj</Button>,
    },
  ];

  return (
    <Card className="main-card mb-3">
      <CardHeader>
        {title}
      </CardHeader>
      <CardBody className="m-2">
        {instruction ? (
          <Alert color="warning">
            {instruction}
          </Alert>
        ) : null}
        <div className="mb-4">
          <Form
            id="importForm"
            data={data}
            config={{
              defaultOnChange: onChange,
              noCards: true,
              onSubmit: async () => {
                setIsProcessing(true);
                await submitMethod(data);
                setIsProcessing(false);
              },
              formGroups: [
                {
                  formElements: fields,
                },
              ],
            }}
          />
        </div>
        {importMessages && importMessages.length ? (
          <Alert color="danger">
            {__('Napotkane błędy podczas importu')}
            :
            <ul className="mb-0">
              {importMessages.map((message) => <li key={message}>{message}</li>)}
            </ul>
          </Alert>
        ) : null}
        <div className="font-weight-bold">Format pliku CSV:</div>
        <div className="">{csvForm}</div>
        <div className="font-weight-bold">Legenda:</div>
        <Table className="mt-2 text-center">
          <thead>
            <tr>
              <th>Klucz</th>
              <th>Znaczenie</th>
            </tr>
          </thead>
          <tbody>
            {legend.map(([field, desc]) => (
              <tr key={field}>
                <td>{field}</td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

ImportForm.propTypes = {
  additionalFields: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
  })),
  csvForm: PropTypes.string,
  instruction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  legend: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  submitMethod: PropTypes.func,
  title: PropTypes.string,
  importMessages: PropTypes.arrayOf(PropTypes.string),
  setImportMessages: PropTypes.func,
};

ImportForm.defaultProps = {
  additionalFields: [],
  csvForm: '',
  instruction: '',
  legend: [],
  importMessages: [],
  setImportMessages: () => {},
  submitMethod: null,
  title: '',
};
