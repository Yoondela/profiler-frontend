import { GoogleMap, Circle } from '@react-google-maps/api';
import { useState } from 'react';
import { useProviderMarkers } from './hooks/useProviderMarkers';
import { getPublicPage } from './helper/getPublickPage';
import { fetchPublicPage } from '@/api/lookup/publicPageApi';
import { useNavigate } from 'react-router-dom';

export default function ServiceAreaMap({ providers, hoveredProviderId }) {
  console.log('Providers in ServiceAreaMap:', providers);

  const navigate = useNavigate();

  console.log(providers);
  console.log(providers[0]);
  console.log('provider location:', providers[0]?.location);
  const [map, setMap] = useState(null);

  async function getPublicPage(providerId) {
    try {
      const providerInfo = await fetchPublicPage(providerId);
      if (providerInfo) {
        navigate(`/providers/${providerId}/public`);
      }
    } catch (err) {
      console.error('Public page error:', err);
    }
  }

  useProviderMarkers({
    map,
    providers,
    hoveredProviderId,
    onMarkerClick: (provider) => {
      getPublicPage(provider._id);
    },
  });

  if (!providers.length) return null;

  const defaultCenter = { lat: -25.7479, lng: 28.2293 }; // Pretoria

  const center = providers.length ? providers[0].location : defaultCenter;

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
