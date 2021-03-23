import React, { useState, useCallback, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import Rating from 'react-rating';
import { Label, Button } from 'reactstrap';
import Form from '../../../../Components/Form/index';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import DataLoading from '../../../../Components/Loading/dataLoading';
import useOperators from '../../../../utils/hooks/operator/useOperators';
import {
  DICTIONARY_COUNTRIES,
  DICTIONARY_TOURISM_OBJECT_TYPES,
} from '../../../../utils/hooks/dictionaries/dictionariesCodes';
import useDictionariesMap from '../../../../utils/hooks/dictionaries/useDictionariesMap';
import { tourismTourismObjectPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import HoursSlider, { parseHourFromBackend, parseHourToBackend } from './utils/hoursSlider';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import { getAnixeValue } from './utils/anixeData';
import Map from './map';

const dictionariesCodes = [DICTIONARY_COUNTRIES, DICTIONARY_TOURISM_OBJECT_TYPES];

const parseDataFromBackend = ({ anixeData, ...data }) => {
  const updatedData = data;
  updatedData.countryCode = getAnixeValue(anixeData, 'countryCode');
  updatedData.anixeName = getAnixeValue(anixeData, 'name');
  updatedData.anixeStreet = getAnixeValue(anixeData, 'street');
  updatedData.anixeCity = getAnixeValue(anixeData, 'city');
  updatedData.anixeEmail = getAnixeValue(anixeData, 'email');
  updatedData.anixeHotelCategory = getAnixeValue(anixeData, 'hotelCategory');
  updatedData.anixePhone = getAnixeValue(anixeData, 'phone');
  updatedData.anixePhone2 = getAnixeValue(anixeData, 'phone2');
  updatedData.anixePostalCode = getAnixeValue(anixeData, 'postalCode');
  updatedData.anixeWebsite = getAnixeValue(anixeData, 'website');

  const {
    checkInFrom, checkInTo, checkOutFrom, checkOutTo,
  } = updatedData;
  const [parsedCheckInFrom, parsedCheckInTo] = parseHourFromBackend(checkInFrom, checkInTo);
  const [parsedCheckOutFrom, parsedCheckOutTo] = parseHourFromBackend(checkOutFrom, checkOutTo);
  updatedData.checkInFrom = parsedCheckInFrom;
  updatedData.checkInTo = parsedCheckInTo;
  updatedData.checkOutFrom = parsedCheckOutFrom;
  updatedData.checkOutTo = parsedCheckOutTo;

  return updatedData;
};

export default function BasicInformation({
  isNew, objectId, refreshData,
}) {
  const [data, updateData] = useState(null);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  useEffect(() => {
    updateData(null);
  }, [objectId]);

  const onChangeCheckInAndOutHours = (key, [from, to]) => {
    const updatedData = { ...data };
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  };
  const operators = useOperators(true);
  const dictionaries = useDictionariesMap(dictionariesCodes);
  const submit = async () => {
    try {
      const {
        checkInFrom, checkInTo, checkOutFrom, checkOutTo,
      } = data;
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-objects/${objectId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
            hotelCategory: parseFloat(data.hotelCategory),
            checkInFrom: parseHourToBackend(checkInFrom),
            checkInTo: parseHourToBackend(checkInTo),
            checkOutFrom: parseHourToBackend(checkOutFrom),
            checkOutTo: parseHourToBackend(checkOutTo),
          },
        },
        data,
      );
      refreshData(data.name);
      dynamicNotification(__('Pomyślnie zapisano obiekt'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać obiektu'), 'error');
    }
  };

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      />
      <DataLoading
        service={TOURISM_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => {
          updateData(parseDataFromBackend(updatedData));
        }}
        endpoint={`/tourism-objects/${objectId}`}
        mockDataEndpoint="/tourismObjects/edit"
        isNew={isNew}
      >
        <Form
          id="basicInformationForm"
          data={data || {}}
          config={{
            stickyTitle: false,
            defaultOnChange: onChange,
            title: 'PODSTAWOWE INFORMACJE',
            groupsAsColumns: true,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                permission: tourismTourismObjectPermissionWrite,
                type: 'submit',
                id: 'basicInformationFormSubmit',
              },
            ],
            onSubmit: submit,
            formGroups: [
              {
                formElements: [
                  {
                    type: 'text',
                    id: 'anixeName',
                    label: 'Pełna nazwa obiektu z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixeName',
                    type: 'button',
                    component: (
                      <div key="useAnixeName" className="my-2">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.name = data.anixeName;

                            data.name ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj nazwę obiektu z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'name',
                    label: 'Pełna nazwa obiektu:',
                    validation: ['required', { method: 'minLength', args: [3] }],
                  },
                  {
                    type: 'text',
                    id: 'marketingName',
                    label: 'Nazwa marketingowa:',
                  },
                  {
                    type: 'text',
                    id: 'anixeId',
                    label: 'Kod obiektu:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'status',
                    label: 'Status:',
                    type: 'select',
                    validation: ['required'],
                    options: statusOptions,
                  },
                  {
                    type: 'text',
                    id: 'suppliers',
                    label: 'Lista dostawców:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'select',
                    label: 'Typ obiektu:',
                    id: 'objectType',
                    options: dictionaries.get(DICTIONARY_TOURISM_OBJECT_TYPES),
                  },
                  {
                    type: 'text',
                    id: 'bookkeeping',
                    label: 'Księgowość:',
                  },
                  {
                    type: 'boolean',
                    isCheckbox: true,
                    id: 'travelPassAllowed',
                    label: 'Pozwalaj na TravelPass',
                  },
                  {
                    type: 'select',
                    id: 'guardianId',
                    label: 'Opiekun:',
                    options: operators,
                  },
                  {
                    component:
  <div key="hotelStandardAnixe">
    <Label>Standard hotelu z ANIXE:</Label>
    <div className="fsize-4">
      <Rating
        id="anixeHotelCategory"
        stop={6}
        readonly
        onChange={(value) => onChange('anixeHotelCategory', value)}
        initialRating={data ? data.anixeHotelCategory : null}
        emptySymbol={[
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
        ]}
        fullSymbol={[
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
        ]}
      />
    </div>
  </div>,
                  },
                  {
                    id: 'useAnixeHotelCategory',
                    type: 'button',
                    component: (
                      <div key="useAnixeHotelCategory" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.hotelCategory = data.anixeHotelCategory;

                            data.hotelCategory ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj standard hotelu z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    component:
  <div key="hotelStandard">
    <Label>Standard hotelu:</Label>
    <div className="fsize-4">
      <Rating
        id="hotelCategory"
        stop={6}
        fractions={2}
        onChange={(value) => onChange('hotelCategory', value)}
        initialRating={data ? data.hotelCategory : null}
        emptySymbol={[
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
          'pe-7s-star text-focus opacity-5 mr-1',
        ]}
        fullSymbol={[
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
          'pe-7s-star text-warning mr-1',
        ]}
      />
    </div>
  </div>,
                  },
                  {
                    component: <HoursSlider
                      onChange={onChangeCheckInAndOutHours}
                      id="checkIn"
                      key={`checkIn${data ? '1' : '0'}`}
                      label={__('Zameldowanie')}
                      valueFrom={data?.checkInFrom}
                      valueTo={data?.checkInTo}
                    />,
                  },
                  {
                    component: <HoursSlider
                      onChange={onChangeCheckInAndOutHours}
                      id="checkOut"
                      key={`checkOut${data ? '1' : '0'}`}
                      label={__('Wymeldowanie')}
                      valueFrom={data?.checkOutFrom}
                      valueTo={data?.checkOutTo}
                    />,
                  },
                  {
                    type: 'text',
                    id: 'destinationCode',
                    label: 'Kod IATA najbliższego miasta:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'text',
                    id: 'descLanguage',
                    label: 'Język opisów:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'text',
                    id: 'detectedDescLanguage',
                    label: 'Wykryty język opisów:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'text',
                    id: 'supplierTermsUrl',
                    label: 'Regulamin dostawcy:',
                    validation: ['url'],
                  },
                ],
              },
              {
                formElements: [
                  {
                    component: <h6 key="contact_info"><strong>DANE KONTAKTOWE</strong></h6>,
                  },
                  {
                    type: 'text',
                    id: 'anixePhone',
                    label: 'Telefon z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixePhone',
                    type: 'button',
                    component: (
                      <div key="useAnixePhone" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.phone = data.anixePhone;

                            data.phone ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj telefon z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'phone',
                    label: 'Telefon:',
                  },
                  {
                    type: 'text',
                    id: 'anixePhone2',
                    label: 'Telefon 2 z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixePhone2',
                    type: 'button',
                    component: (
                      <div key="useAnixePhone2" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.phone2 = data.anixePhone2;
                            data.phone2 ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj telefon 2 z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'phone2',
                    label: 'Telefon 2:',
                  },
                  {
                    type: 'text',
                    id: 'anixeWebsite',
                    label: 'Strona www z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixeWebsite',
                    type: 'button',
                    component: (
                      <div key="useAnixeWebsite" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.website = data.anixeWebsite;
                            data.website ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj stronę www z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'website',
                    label: 'Strona www:',
                  },
                  {
                    type: 'text',
                    id: 'anixeEmail',
                    label: 'E-mail z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixeEmail',
                    type: 'button',
                    component: (
                      <div key="useAnixeEmail" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.email = data.anixeEmail;
                            data.email ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj adres e-mail z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'email',
                    label: 'E-mail:',
                    validation: ['email'],
                  },
                  {
                    component: <Map
                      key="google_map"
                      lng={data?.longitude}
                      lat={data?.latitude}
                    />,
                  },
                  {
                    type: 'text',
                    id: 'latitude',
                    label: 'Szerokość geograficzna:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'text',
                    id: 'longitude',
                    label: 'Długość geograficzna:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    type: 'select',
                    id: 'countryCode',
                    props: {
                      disabled: true,
                    },
                    label: 'Kraj:',
                    options: dictionaries.get(DICTIONARY_COUNTRIES),
                  },
                  {
                    type: 'text',
                    id: 'province',
                    label: 'Województwo:',
                  },
                  {
                    type: 'text',
                    id: 'anixeStreet',
                    label: 'Ulica z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixeStreet',
                    type: 'button',
                    component: (
                      <div key="useAnixeStreet" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.street = data.anixeStreet;
                            data.street ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj ulicę z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'street',
                    label: 'Ulica:',
                  },
                  {
                    type: 'text',
                    id: 'anixeCity',
                    label: 'Miasto z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixeCity',
                    type: 'button',
                    component: (
                      <div key="useAnixeCity" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.city = data.anixeCity;
                            data.city ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj miasto z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'city',
                    label: 'Miasto:',
                  },
                  {
                    type: 'text',
                    id: 'anixePostalCode',
                    label: 'Kod pocztowy z ANIXE:',
                    props: {
                      disabled: true,
                    },
                  },
                  {
                    id: 'useAnixePostalCode',
                    type: 'button',
                    component: (
                      <div key="useAnixePostalCode" className="my-1">
                        <Button
                          color="light"
                          onClick={() => {
                            const updatedData = { ...data };
                            updatedData.postalCode = data.anixePostalCode;
                            data.postalCode ? getUserConfirmationPopup(
                              __('Wartość pola zostanie nadpisana'),
                              (confirm) => confirm && updateData(updatedData),
                              __('Czy na pewno chcesz skopiować dane?'),
                            ) : updateData(updatedData);
                          }}
                        >
                          {__('Skopiuj kod pocztowy z ANIXE')}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'postalCode',
                    label: 'Kod pocztowy:',
                  },
                  {
                    component: (
                      <h6 key="notification_data">
                        <strong>DANE DO POWIADOMIEŃ</strong>
                      </h6>
                    ),
                  },
                  {
                    type: 'text',
                    id: 'emailForNotifications',
                    label: 'Adres e-mail do powiadomień:',
                  },
                  {
                    type: 'text',
                    id: 'phoneForNotifications',
                    label: 'Numer telefonu dla SMS:',
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </>
  );
}

BasicInformation.propTypes = {
  objectId: PropTypes.string.isRequired,
  refreshData: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
};

export const statusOptions = [
  { value: 'new', label: 'Nowy' },
  { value: 'active', label: 'Aktywny' },
  { value: 'inactive', label: 'Nieaktywny' },
];
