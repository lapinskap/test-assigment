import React, { useCallback, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import Form from '../../../Components/Form/index';
import {
  LOCALIZATION_TYPE_ADDRESS,
  LOCALIZATION_TYPE_CITIES,
  LOCALIZATION_TYPE_OVERRIDING, OVERRIDING_LOCATION_FIELD,
  useCategoryOptions,
} from './utils';
import useSuppliers from '../../../utils/hooks/suppliers/useSuppliers';
import { catalogProductPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import useDictionariesMap from '../../../utils/hooks/dictionaries/useDictionariesMap';
import { DICTIONARY_PRODUCT_CODE_REALIZATION_PLACE, DICTIONARY_PRODUCT_PARENT_LOCATION } from '../../../utils/hooks/dictionaries/dictionariesCodes';
import SearchBox from './Components/GoogleApiSearchInput';
import useConfigValue from '../../../utils/hooks/configuration/useConfigValue';
import { MAP_CONFIG_VALUE_PATH } from '../../../utils/hooks/configuration/configurationFields';
import isObject from '../../../utils/jsHelpers/isObject';
import { LAYOUT_ONE_COLUMN } from '../../../Components/Layouts';

const dictionariesCodes = [DICTIONARY_PRODUCT_CODE_REALIZATION_PLACE, DICTIONARY_PRODUCT_PARENT_LOCATION];

export default function BasicInfo({
  data, setData, next, title,
}) {
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const onChangeLocation = (key, value) => {
    if (key === OVERRIDING_LOCATION_FIELD) {
      onChange('locationData', { [key]: value });
    } else {
      const newLocationData = isObject(data?.locationData) ? { ...data.locationData, [key]: value } : {};
      onChange('locationData', newLocationData);
    }
  };

  const onChangeLocationType = (key, value) => {
    const updatedData = { ...data };
    delete updatedData.cities;
    delete updatedData.city;
    delete updatedData[OVERRIDING_LOCATION_FIELD];
    delete updatedData.postCode;
    delete updatedData.street;
    updatedData[key] = value;
    setData(updatedData);
  };

  const locationType = data ? data.locationType : null;
  const locationData = data ? data.locationData : null;

  const onChangeCities = (key, value) => {
    if (Array.isArray(locationData)) {
      onChange('locationData', locationData.filter((el, index) => value.includes(index)));
    } else {
      onChange('locationData', []);
    }
  };

  const categoryOptions = useCategoryOptions();
  const googleApiKey = useConfigValue(MAP_CONFIG_VALUE_PATH);

  const suppliers = useSuppliers(true, false, true);
  const dictionaries = useDictionariesMap(dictionariesCodes);

  const submit = async () => {
    await next();
  };

  useEffect(() => {
    if (
      !window.google && googleApiKey
    ) {
      window.resolveGoogleMapsPromise = () => {
        delete window.resolveGoogleMapsPromise;
      };
      const script = document.createElement('script');
      script.src = `https://maps.google.com/maps/api/js?key=${googleApiKey}&language=pl&libraries=places&callback=resolveGoogleMapsPromise`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [googleApiKey]);

  let formLocationData = {};
  let citiesOptions = [];
  if (Array.isArray(locationData)) {
    formLocationData = {
      cities: locationData.map((el, index) => index),
    };
    citiesOptions = locationData.map(({ city, voivodeship }, index) => ({ value: index, label: `${city}${voivodeship ? ` (${voivodeship})` : ''}` }));
  } else if (locationData) {
    formLocationData = {
      ...locationData,
      city: locationData.city ? `${locationData.city}${locationData.voivodeship ? ` (${locationData.voivodeship})` : ''}` : undefined,
    };
  }

  const formData = data ? { ...data, ...formLocationData } : {};

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Form
          id="step2Form"
          data={formData}
          config={{
            stickyTitle: false,
            noCards: true,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            onSubmit: submit,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'step2FormSubmit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'text',
                    id: 'name',
                    label: 'Nazwa:',
                    translatable: {
                      scope: 'catalog-management_product_name',
                    },
                    validation: ['required', { method: 'minLength', args: [3] }],
                  },
                  {
                    id: 'active',
                    label: 'Aktywny',
                    type: 'boolean',
                  },
                  {
                    type: 'autocomplete',
                    label: 'Dostawca:',
                    id: 'supplierId',
                    options: suppliers,
                    validation: ['required'],
                  },
                  {
                    type: 'autocomplete',
                    label: 'Kategoria biznesowa:',
                    id: 'businessCategory',
                    validation: ['required'],
                    options: categoryOptions,
                  },
                  {
                    type: 'radio',
                    label: 'Lokalizacja:',
                    id: 'locationType',
                    onChange: onChangeLocationType,
                    options: [
                      { value: LOCALIZATION_TYPE_ADDRESS, label: 'adres obiektu' },
                      { value: LOCALIZATION_TYPE_CITIES, label: 'miasta' },
                      { value: LOCALIZATION_TYPE_OVERRIDING, label: 'lokalizacja nadrzędna' },
                    ],
                    validation: ['required'],
                  },
                  {
                    layout: LAYOUT_ONE_COLUMN,
                    border: true,
                    formElements: [
                      {
                        displayCondition: [LOCALIZATION_TYPE_ADDRESS, LOCALIZATION_TYPE_CITIES].includes(locationType),
                        component: <SearchBox
                          key="googleApiSearchBox"
                          locationType={locationType}
                          onChange={onChange}
                          locationData={formData.locationData}
                        />,
                      },
                      {
                        type: 'autocompleteMultiselect',
                        id: 'cities',
                        label: 'Miasta:',
                        displayCondition: locationType === LOCALIZATION_TYPE_CITIES,
                        options: citiesOptions,
                        onChange: onChangeCities,
                        validation: ['required'],
                      },
                      {
                        type: 'text',
                        id: 'city',
                        label: 'Miasto:',
                        validation: ['required'],
                        placeholder: 'Znajdź miasto w polu powyżej',
                        props: {
                          disabled: true,
                        },
                        displayCondition: locationType === LOCALIZATION_TYPE_ADDRESS,
                      },
                    ],
                  },
                  {
                    type: 'text',
                    id: 'postCode',
                    label: 'Kod pocztowy:',
                    validation: ['required', 'postCode'],
                    onChange: onChangeLocation,
                    valueFormatter: 'post_code',
                    displayCondition: locationType === LOCALIZATION_TYPE_ADDRESS,
                  },
                  {
                    type: 'text',
                    id: 'street',
                    label: 'Ulica:',
                    onChange: onChangeLocation,
                    validation: ['required'],
                    displayCondition: locationType === LOCALIZATION_TYPE_ADDRESS,
                  },
                  {
                    type: 'select',
                    id: OVERRIDING_LOCATION_FIELD,
                    label: 'Lokalizacja nadrzędna:',
                    displayCondition: locationType === LOCALIZATION_TYPE_OVERRIDING,
                    onChange: onChangeLocation,
                    validation: ['required'],
                    options: dictionaries.get(DICTIONARY_PRODUCT_PARENT_LOCATION),
                  },
                ],
              },
              {
                formElements: [
                  {
                    type: 'autocomplete',
                    id: 'codeRealizationPlace',
                    label: 'Miejsce realizacji kodu:',
                    options: dictionaries.get(DICTIONARY_PRODUCT_CODE_REALIZATION_PLACE),
                  },
                  {
                    type: 'text',
                    id: 'facilityEmailAddress',
                    label: 'Adres e-mail obiektu:',
                    validation: ['email'],
                  },
                  {
                    type: 'text',
                    id: 'facilityWebPage',
                    label: 'Strona www obiektu:',
                    validation: [{ method: 'minLength', args: [3] }],
                  },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

BasicInfo.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  next: PropTypes.func,
  setData: PropTypes.func.isRequired,
  title: PropTypes.string,
};

BasicInfo.defaultProps = {
  next: () => {
  },
  title: null,
};
