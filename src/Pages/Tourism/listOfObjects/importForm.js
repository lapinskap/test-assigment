import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Alert, Table,
} from 'reactstrap';
import Form from '../../../Components/Form';
import Popup from '../../../Components/Popup/popup';
import { fileToBase64 } from '../../../utils/Parsers/fileToBase64';
import { restApiRequest, TOURISM_SERVICE } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import parseDefaultImportResult from '../../../utils/import/parseDefaultImportResult';

export default function ImportForm({ close, isOpen }) {
  const [data, updateData] = useState({});
  const [importMessages, setImportMessages] = useState([]);

  const instruction = (
    <>
      <ul>
        <li>Plik wymaga podania nagłówka z nazwami pól które śa aktualizowane</li>
      </ul>
    </>
  );

  const importCSV = async () => {
    try {
      const formData = { ...data };
      const method = 'POST';
      const path = '/tourism-objects/import';
      let fileData = {};
      if (formData.file && formData.file[0]) {
        fileData = {
          file: await fileToBase64(formData.file[0]),
          fileName: formData.file[0].name,
        };
      }
      const response = await restApiRequest(
        TOURISM_SERVICE,
        path,
        method,
        {
          body: {
            ...formData,
            ...fileData,
          },
        },
        data,
      );
      const {
        success, processed, errors,
      } = parseDefaultImportResult(response);
      if (success) {
        dynamicNotification(__('Pomyślnie zaimportowano {0} obiektów', [processed]));
      } else {
        setImportMessages(errors);
        dynamicNotification(__('Zaimportowano z błędami', [processed]), 'warning');
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać pliku CSV'), 'error');
    }
  };

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setImportMessages([]);
  };

  const fields = [
    {
      component: instruction ? (
        <Alert color="warning">
          {instruction}
        </Alert>
      ) : <div />,
    },
    {
      id: 'file',
      type: 'file',
      label: 'Plik CSV',
    },
    {
      type: 'button',
      label: 'Importuj',
      id: 'import',
      onChange: importCSV,
    },
    {
      component:
  <div className="mt-3">
    {importMessages && importMessages.length ? (
      <Alert color="danger">
        {__('Napotkane błędy podczas importu')}
        <ul className="mb-0 pl-3">
          {importMessages.map((message) => <li key={message}>{message}</li>)}
        </ul>
      </Alert>
    ) : null}
    <div className="font-weight-bold">Format pliku CSV:</div>
    <div className="text-break">{csvForm}</div>
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
  </div>,
    },
  ];

  return (
    <Popup id="importObjectPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose className="modal-lg">
      <Form
        data={data}
        id="importObjectForm"
        config={{
          defaultOnChange: onChange,
          noCards: true,
          isInPopup: true,
          togglePopup: close,
          title: 'Import obiektów turystycznych',
          buttons: [
            {
              size: 'lg',
              color: 'light',
              className: 'mr-2',
              text: 'Zamknij',
              type: 'button',
              onClick: close,
            },
          ],
          onSubmit: () => {},
          formGroups: [
            {
              formElements: fields,
            },
          ],
        }}
      />
    </Popup>
  );
}

ImportForm.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

// eslint-disable-next-line max-len
const csvForm = 'id,guardianId,status,name,marketingName,objectType,travelPassAllowed,hotelCategory,phone,phone2,website,email,countryCode,street,city,postalCode,emailForNotifications,phoneForNotifications,statement,shortDescription,description,objectRules,useDefaultFulfilmentRules,customFulfilmentRules,searchEngineKeywords,checkInFrom,checkInTo,checkOutFrom,checkOutTo';

const legend = [
  ['id', 'id obiektu'],
  ['guardianId', 'opiekun'],
  ['status', 'status'],
  ['name', 'pełna nazwa obiektu'],
  ['marketingName', 'nazwa marketingowa'],
  ['objectType', 'typ obiektu'],
  ['travelPassAllowed', 'pozwalaj na TravelPass'],
  ['hotelCategory', 'standard hotelu'],
  ['phone', 'telefon'],
  ['phone2', 'telefon 2'],
  ['email', 'adres e-mail'],
  ['countryCode', 'dwuliterowy kod państwa'],
  ['street', 'ulica'],
  ['city', 'miasto'],
  ['postalCode', 'kod pocztowy'],
  ['emailForNotifications', 'adres e-mail do powiadomień'],
  ['phoneForNotifications', 'telefon do powiadomień'],
  ['statement', 'komunikat'],
  ['shortDescription', 'krótki opis'],
  ['description', 'opis'],
  ['objectRules', 'zasady obiektu'],
  ['useDefaultFulfilmentRules', 'używaj domyślnych zasad obiektu'],
  ['customFulfilmentRules', 'zasady realizacji'],
  ['searchEngineKeywords', 'słowa kluczowe dla języka wyszukiwania'],
  ['checkInFrom', 'zameldowanie od'],
  ['checkInTo', 'zameldowanie do'],
  ['checkOutFrom', 'wymeldowanie od'],
  ['checkOutTo', 'wymeldowanie do'],
];
