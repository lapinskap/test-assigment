import React from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import useConfigValue from '../../../../utils/hooks/configuration/useConfigValue';
import { MAP_CONFIG_VALUE_PATH } from '../../../../utils/hooks/configuration/configurationFields';

const Pin = () => <div className="map-pin" />;

export default function Map({ lat, lng }) {
  const googleApiKey = useConfigValue(MAP_CONFIG_VALUE_PATH);

  if (!lat || !lng || !googleApiKey) {
    return null;
  }

  return (
    <>
      <h6 key="object_location"><strong>POŁOŻENIE OBIEKTU</strong></h6>
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleApiKey }}
          defaultCenter={{
            lat: +lat,
            lng: +lng,
          }}
          defaultZoom={11}
        >
          <Pin
            lat={+lat}
            lng={+lng}
          />
        </GoogleMapReact>
      </div>
    </>
  );
}

Map.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
};

Map.defaultProps = {
  lat: null,
  lng: null,
};
