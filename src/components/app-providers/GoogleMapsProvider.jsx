import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

export default function GoogleMapsProvider({ children }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) {
    return <div>Loading maps…</div>;
  }

  return children;
}
