import React from 'react';
import MapView, { Marker, Overlay, PROVIDER_GOOGLE } from 'react-native-maps';
import { globalStyles } from '../styles/globalStyles';

const SolarMap = ({ region, overlay }) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={globalStyles.map}
      region={region}
      mapType="satellite"
    >
      <Marker coordinate={region} />
      {overlay && (
        <Overlay
          image={{ uri: overlay.image }}
          bounds={overlay.bounds}
        />
      )}
    </MapView>
  );
};

export default SolarMap;
