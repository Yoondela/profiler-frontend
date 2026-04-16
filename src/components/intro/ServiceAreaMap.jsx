import { GoogleMap, Circle } from '@react-google-maps/api';
import { useState } from 'react';
import { useProviderMarkers } from './hooks/useProviderMarkers';

export default function ServiceAreaMap({ providers, hoveredProviderId }) {
  console.log('Providers in ServiceAreaMap:', providers);

  console.log(providers)
  console.log(providers[0])
  console.log('provider location:', providers[0]?.location);


  if (!providers.length) return null;

  const [map, setMap] = useState(null);

  const defaultCenter = { lat: -25.7479, lng: 28.2293 }; // Pretoria

  const center = providers.length
    ? providers[0].location
    : defaultCenter;

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
      mapContainerStyle={{ width: '100%', height: '110%' }}
      center={center}
      zoom={11}
      onLoad={setMap}
      options={{
        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
        disableDefaultUI: true,
        zoomControl: true,
      }}
    />
  );
}
