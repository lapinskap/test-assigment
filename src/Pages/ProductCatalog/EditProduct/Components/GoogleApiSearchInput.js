import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Label, FormGroup } from 'reactstrap';
import { LOCALIZATION_TYPE_ADDRESS, LOCALIZATION_TYPE_CITIES } from '../utils';
import __ from '../../../../utils/Translations';

export default function SearchBox({ onChange, locationType, locationData }) {
  const [lastFoundItem, setLastFoundItem] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (lastFoundItem) {
      if (locationType === LOCALIZATION_TYPE_CITIES) {
        const currentLocationData = Array.isArray(locationData) ? [...locationData] : [];
        onChange('locationData', [...currentLocationData, lastFoundItem]);
      } else if (locationType === LOCALIZATION_TYPE_ADDRESS) {
        onChange('locationData', { ...(locationData || {}), ...lastFoundItem });
      }
    }
    setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastFoundItem]);

  const { google } = window;
  const input = useRef();
  useEffect(() => {
    let autocomplete;
    if (google?.maps?.places?.Autocomplete) {
      autocomplete = new google.maps.places.Autocomplete(input.current, { language: 'pl' });
      autocomplete.setComponentRestrictions({ country: ['pl'] });
      autocomplete.setTypes(['(cities)']);
      autocomplete.setFields([
        'address_components',
        'geometry',
        'name',
      ]);
      autocomplete.set('language', 'pl');

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          let voivodeship = null;
          let city = null;
          let postCode = null;
          const location = {
            lat: place.geometry?.location.lat(),
            lng: place.geometry?.location.lng(),
          };
          place.address_components.forEach(({ types, long_name: value }) => {
            const mainType = types[0];
            if (mainType === 'locality') {
              city = value;
            } else if (mainType === 'administrative_area_level_1') {
              voivodeship = value;
            } else if (mainType === 'postal_code') {
              postCode = value;
            }
          });
          setLastFoundItem({
            city, voivodeship, postCode, location,
          });
        }
      });
    }
    return () => google?.maps?.event?.clearInstanceListeners(autocomplete);
  }, [google]);
  if (![LOCALIZATION_TYPE_CITIES, LOCALIZATION_TYPE_ADDRESS].includes(locationType)) {
    return null;
  }
  return (
    <FormGroup>
      <Label for="googleApiSearchInput">
        {__('Dodaj miasto')}
        :
      </Label>
      <InputGroup>
        <input
          id="googleApiSearchInput"
          ref={input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value || '')}
          className="form-control"
          placeholder="Znajdź miasto"
        />
      </InputGroup>
    </FormGroup>
  );
}

SearchBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  locationData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  locationType: PropTypes.string,
};
SearchBox.defaultProps = {
  locationType: '',
  locationData: null,
};
