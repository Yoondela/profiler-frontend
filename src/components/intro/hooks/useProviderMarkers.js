import { useEffect, useRef } from 'react';

/**
 * Manages Google Maps markers imperatively for providers
 */
export function useProviderMarkers({
  map,
  providers,
  hoveredProviderId,
  onMarkerClick,
}) {
  // Stores: providerId -> google.maps.Marker
  const markersRef = useRef(new Map());

  useEffect(() => {
    if (!map) return;

    const nextIds = new Set(providers.map((p) => p._id));

    // 1. REMOVE markers that no longer exist
    markersRef.current.forEach((marker, providerId) => {
      if (!nextIds.has(providerId)) {
        marker.setMap(null);
        markersRef.current.delete(providerId);
      }
    });

    // 2. ADD missing markers
    providers.forEach((provider) => {
      if (markersRef.current.has(provider._id)) return;

      const marker = new google.maps.Marker({
        map,
        position: provider.location,
        icon: getMarkerIcon(provider, false),
        clickable: true,
      });

      if (onMarkerClick) {
        marker.addListener('click', () => {
          onMarkerClick(provider);
        });
      }

      markersRef.current.set(provider._id, marker);
    });

    // 3. UPDATE marker styles (hover, zIndex)
    markersRef.current.forEach((marker, providerId) => {
      const provider = providers.find((p) => p._id === providerId);
      if (!provider) return;

      const isHovered = providerId === hoveredProviderId;

      marker.setIcon(getMarkerIcon(provider, isHovered));
      marker.setZIndex(isHovered ? 1000 : 1);
    });
  }, [map, providers, hoveredProviderId, onMarkerClick]);
}

function resolveIconSource(provider) {
  if (provider.logoUrl) return provider.logoUrl;
  if (provider.avatarUrl) return provider.avatarUrl;

  const service = provider.servicesOffered?.[0];
  if (service) return `/icons/services/${service}.svg`;

  return '/icons/default-provider.svg';
}

function getMarkerIcon(provider, isHovered) {
  const size = isHovered ? 40 : 32;

  return {
    url: resolveIconSource(provider),
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
  };
}
