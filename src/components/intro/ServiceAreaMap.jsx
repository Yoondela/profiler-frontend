import { GoogleMap, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -33.9249,
  lng: 18.4241,
};

export default function ServiceAreaMap({ providers, hoveredProviderId }) {
  console.log('Providers in ServiceAreaMap:', providers);
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={providers[0]?.location || defaultCenter}
      zoom={11}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {providers.map((provider) => {
        const isHovered = provider._id === hoveredProviderId;
        return (
          <Circle
            key={provider.id}
            center={provider.location}
            radius={3 * 100}
            options={{
              fillColor: isHovered ? '#2563eb' : '#22c55e',
              strokeColor: isHovered ? '#1e40af' : '#16a34a',
              fillOpacity: isHovered ? 0.35 : 0.15,
              strokeWeight: isHovered ? 2 : 1,
              clickable: false,
            }}
          />
        );
      })}
    </GoogleMap>
  );
}
