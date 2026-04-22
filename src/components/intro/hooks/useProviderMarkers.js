import { useEffect, useRef } from 'react';

/**
 * Manages Google Maps Advanced Markers for providers
 */
export function useProviderMarkers({
  map,
  providers,
  hoveredProviderId,
  onMarkerClick,
}) {
  // Stores: providerId -> AdvancedMarkerElement
  const markersRef = useRef(new Map());

  console.log('marker lib:', window.google?.maps?.marker);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;

    const nextIds = new Set(providers.map((p) => p._id));

    // 1. REMOVE
    markersRef.current.forEach((marker, providerId) => {
      if (!nextIds.has(providerId)) {
        marker.map = null;
        markersRef.current.delete(providerId);
      }
    });

    // 2. ADD
    providers.forEach((provider) => {
      if (markersRef.current.has(provider._id)) return;

      const isHovered = provider._id === hoveredProviderId;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: provider.location, // ⚠️ validate this!
        content: createMarkerContent(provider),
        zIndex: isHovered ? 1000 : 1,
      });

      if (onMarkerClick) {
        marker.addListener('click', () => {
          onMarkerClick(provider);
        });
      }

      markersRef.current.set(provider._id, marker);
    });

    // 3. UPDATE
    markersRef.current.forEach((marker, providerId) => {
      const isHovered = providerId === hoveredProviderId;

      marker.content.classList.toggle('marker--hovered', isHovered);
      marker.zIndex = isHovered ? 1000 : 1;
    });
  }, [map, providers, hoveredProviderId, onMarkerClick]);
}

/**
 * Resolve which image to use for the marker
 */
function resolveIconSource(provider) {
  if (provider.logoUrl) return provider.logoUrl;
  if (provider.avatarUrl) return provider.avatarUrl;

  const service = provider.servicesOffered?.[0];
  if (service) return `/icons/services/${service}.svg`;

  return '/icons/default-provider.svg';
}

/**
 * Creates DOM content for Advanced Marker
 */
function createMarkerContent(provider) {
  const container = document.createElement('div');

  container.className = 'marker';

  container.innerHTML = `
    <div class="marker__inner">
      <img src="${resolveIconSource(provider)}" />
    </div>
  `;

  return container;
}
