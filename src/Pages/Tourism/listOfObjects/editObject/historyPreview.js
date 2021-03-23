import React, { useState, useEffect } from 'react';
import {
  Alert, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import __ from '../../../../utils/Translations';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { tourismTourismObjectPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../Components/Popup/popup';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import { rangeValueToHourFormatter } from './utils/hoursSlider';
import useDictionary from '../../../../utils/hooks/dictionaries/useDictionary';
import { statusOptions } from './basicInformation';
import { DICTIONARY_TOURISM_OBJECT_TYPES } from '../../../../utils/hooks/dictionaries/dictionariesCodes';

export default function HistoryPreview({
  close, isOpen, isBeingRestored, previewItem, operators,
}) {
  const [attributesData, setAttributesData] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const { newValues, oldValues } = previewItem;
  const fields = Object.keys(newValues);
  const tourismObjectTypes = useDictionary(fields.includes('objectType') ? DICTIONARY_TOURISM_OBJECT_TYPES : null, true);

  const needToFetchAttributes = fields.includes('optionValues');
  useEffect(() => {
    if (needToFetchAttributes) {
      restApiRequest(
        TOURISM_SERVICE,
        '/tourism-attributes',
        'GET',
        {
          itemsPerPage: 10000,
        },
        [],
      ).then((res) => setAttributesData(res))
        .catch((e) => {
          console.error(e);
          dynamicNotification('Nie udało się pobrać opisów atrybutów', 'error');
        });
    }
  }, [needToFetchAttributes, setAttributesData]);

  useEffect(() => {
    if (isBeingRestored) {
      restApiRequest(
        TOURISM_SERVICE,
        `/tourism-objects/${previewItem.objectId}`,
        'GET',
        {},
        [],
      ).then((res) => setCurrentData(res))
        .catch((e) => {
          console.error(e);
          dynamicNotification('Nie udało się pobrać aktualnych wartości', 'error');
        });
    }
  }, [isBeingRestored, setCurrentData, previewItem.objectId]);

  const data = fields.map((key) => {
    let source;
    switch (key) {
      case 'status':
        source = statusOptions;
        break;
      case 'guardianId':
        source = operators;
        break;
      case 'objectType':
        source = tourismObjectTypes;
        break;
      case 'optionValues':
        source = attributesData;
        break;
      default:
        source = null;
    }
    const newValue = isBeingRestored ? currentData[key] : newValues[key];
    const oldValue = oldValues[key];
    return {
      field: mapKeyToLabel[key] || key,
      newValues: parseValue(newValue, key, source),
      oldValues: parseValue(oldValue, key, source),
    };
  });
  const revert = async () => {
    try {
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-object-changelogs/${previewItem.id}/revert`,
        'GET',
        {},
        null,
      );
      dynamicNotification(__('Pomyślnie przywrócono zmiany na obiekcie turystycznym'));
      close(true);
    } catch (e) {
      dynamicNotification(e.message || __('Nie udało się przywrócić zmian', 'error'));
      console.error(e);
    }
  };

  return (
    <Popup id="historyPreviewPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="xxl">
      <ModalHeader toggle={() => close()} />
      {isBeingRestored ? (
        <Alert color="danger">
          {__('Uwaga! Zamierzasz zmienić wiele wartości. Zapoznaj się z poniższą listą zmian, które zostaną wprowadzone.'
                        + ' Aby potwierdzić operację przywrócenia, kliknij w przycisk Przywróć.')}
          <RbsButton
            permission={tourismTourismObjectPermissionWrite}
            color="danger"
            onClick={revert}
            className="d-block btn-actions-pane-right"
            data-t1="restore"
          >
            {__('Przywróć')}
          </RbsButton>
        </Alert>
      ) : null}
      <DataTable
        id="tourismObjectHistoryListing"
        columns={[
          {
            Header: 'Pole',
            accessor: 'field',
            width: 200,
          },
          {
            Header: isBeingRestored ? 'Aktualne wartości' : 'Przed zmianami',
            accessor: isBeingRestored ? 'newValues' : 'oldValues',
          },
          {
            Header: isBeingRestored ? 'Po przywróceniu' : 'Po zmianach',
            accessor: isBeingRestored ? 'oldValues' : 'newValues',
          },
        ]}
        data={data}
        sortable={false}
        filterable={false}
        showPagination={false}
      />
    </Popup>
  );
}

HistoryPreview.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isBeingRestored: PropTypes.bool.isRequired,
  operators: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  previewItem: PropTypes.shape({
    oldValues: PropTypes.shape({}),
    newValues: PropTypes.shape({}),
    id: PropTypes.string,
    objectId: PropTypes.string,
  }).isRequired,
};

const parseValue = (value, key, source = null) => {
  const type = typeof value;

  if (value == null) {
    return <span className="font-italic">{__('brak')}</span>;
  }

  switch (key) {
    case 'hotelCategory':
      return __('Ilość gwiazdek: {0}', [value]);
    case 'checkInFrom':
    case 'checkInTo':
    case 'checkOutFrom':
    case 'checkOutTo':
      return rangeValueToHourFormatter(value);
    case 'status':
    case 'guardianId':
    case 'objectType':
      return valueToLabelMapper(value, source);
    case 'gallery':
      if (!Array.isArray(value) || value.length === 0) {
        return <span className="font-italic">{__('brak')}</span>;
      }
      return (
        <div style={{
          display: 'grid', position: 'relative', top: '15px',
        }}
        >
          {value.map(({
            alt, name, url, position,
          }) => (
            <div key={position} style={{ display: 'flex', flexDirection: 'row', border: 'solid 1px' }}>
              <img alt={alt} name={name} src={url} width={200} style={{ minHeight: '100px' }} />
              <div className="pt-5 ml-1 text-left">
                <div>
                  {__('Nazwa')}
                  :
                  {name || __('brak')}
                </div>
                <div>
                  {__('Alt')}
                  :
                  {alt || __('brak')}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'optionValues':
      if (!value) {
        return <span className="font-italic">{__('brak')}</span>;
      }
      // eslint-disable-next-line no-case-declarations
      const result = {};
      Object.keys(value).forEach((attributeCode) => {
        const attributeDef = source.find(({ code }) => code === attributeCode) || { name: attributeCode, options: [] };
        if (attributeDef) {
          const attributeOptionsObject = value[attributeCode];
          const options = [];
          Object.keys(attributeOptionsObject).forEach((code) => {
            if (attributeOptionsObject[code] === 1) {
              const attributeOptionDef = attributeDef.options.find(({ code: optionCode }) => optionCode === code);
              if (attributeOptionDef) {
                options.push(attributeOptionDef.label);
              }
            }
          });
          if (options.length) {
            result[attributeDef.name] = options;
          }
        }
      });
      if (Object.keys(result).length === 0) {
        return <span className="font-italic">{__('brak')}</span>;
      }
      return (
        <div className="text-left">
          {Object.keys(result).map((attributeName) => (
            <div>
              {attributeName}
              :
              <ul>
                {result[attributeName].map((attributeOptionLabel) => (
                  <li className="ml-2">
                    {attributeOptionLabel}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    default:
      if (type === 'boolean') {
        return value ? <span className="font-italic">{__('TAK')}</span>
          : <span className="font-italic">{__('NIE')}</span>;
      }
      if (type === 'string') {
        return value;
      }
      break;
  }
  return 'brak danych';
};

const valueToLabelMapper = (value, options) => {
  const matchedOption = options.find(({ value: optionValue }) => optionValue === value);
  return matchedOption?.label || value;
};

const mapKeyToLabel = {
  guardianId: 'Opiekun',
  bookkeeping: 'Księgowość',
  status: 'Status',
  name: 'Pełna nazwa obiektu',
  marketingName: 'Nazwa marketingowa',
  supplierTermsUrl: 'Regulamin dostawcy',
  objectType: 'Typ obiektu',
  travelPassAllowed: 'Pozwalaj na TravelPass',
  hotelCategory: 'Standard hotelu',
  phone: 'Telefon',
  phone2: 'Telefon 2',
  website: 'Strona www',
  email: 'E-mail',
  street: 'Ulica',
  city: 'Miasto',
  province: 'Województwo',
  postalCode: 'Kod pocztowy',
  emailForNotifications: 'Adres e-mail do powiadomień',
  phoneForNotifications: 'Numer telefonu dla SMS',
  gallery: 'Galeria',
  statement: 'Komunikat',
  shortDescription: 'Krótki opis',
  description: 'Opis właściwy',
  objectRules: 'Zasady obiektu',
  useDefaultFulfilmentRules: 'Użyj domyślnych zasad realizacji',
  customFulfilmentRules: 'Zasady realizacji',
  searchEngineKeywords: 'słowa kluczowe dla języka wyszukiwania',
  optionValues: 'Przypisane atrybuty',
  checkInFrom: 'Zameldowanie od',
  checkInTo: 'Zameldowanie do',
  checkOutFrom: 'Wymeldowanie od',
  checkOutTo: 'Wymeldowanie do',
};
