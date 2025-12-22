import { GoogleMap, Circle } from '@react-google-maps/api';
import { useState } from 'react';
import { useProviderMarkers } from './hooks/useProviderMarkers';

export default function ServiceAreaMap({ providers, hoveredProviderId }) {
  console.log('Providers in ServiceAreaMap:', providers);

  const [map, setMap] = useState(null);

  useProviderMarkers({
    map,
    providers,
    hoveredProviderId,
    onMarkerClick: (provider) => {
      console.log('Marker clicked:', provider._id);
    },
  });

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={providers[0]?.location || { lat: -33.9249, lng: 18.4241 }}
      zoom={11}
      onLoad={setMap}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    />
  );
}
