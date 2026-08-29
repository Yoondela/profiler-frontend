import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ShieldCheck, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useServiceRequest } from '../contexts/ServiceRequestContext';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
import ServiceField from '../formField/ServiceField';
import { useCity } from '@/components/city/context/cityContext';
import { getLatLngBounds } from '@/utils/getCityBounds';
import { RequestDrawer } from '../confirm/confirm';
import { Autocomplete } from '@react-google-maps/api';

export default function ServiceRequestForm() {
  // ---------------------------
  // CONTEXT (SOURCE OF TRUTH)
  // ---------------------------
  const { userService, setUserService, userLocation, setUserLocation } =
    useServiceRequest();

  const { city } = useCity();

  const MOCK_ADDRESS = {
    address:
      '1 Lower Long Street, Cape Town City Centre, Cape Town, 8001, South Africa',
    placeId: 'mock-place-id-001',
    lng: 18.4233,
    lat: -33.9154,
    geometry: {
      location: {
        lat: -33.9154,
        lng: 18.4233,
      },
    },
    addressComponents: [
      {
        long_name: '1',
        short_name: '1',
        types: ['street_number'],
      },
      {
        long_name: 'Lower Long Street',
        short_name: 'Lower Long St',
        types: ['route'],
      },
      {
        long_name: 'Cape Town City Centre',
        short_name: 'Cape Town City Centre',
        types: ['sublocality'],
      },
      {
        long_name: 'Cape Town',
        short_name: 'Cape Town',
        types: ['locality'],
      },
      {
        long_name: 'Western Cape',
        short_name: 'WC',
        types: ['administrative_area_level_1'],
      },
      {
        long_name: '8001',
        short_name: '8001',
        types: ['postal_code'],
      },
      {
        long_name: 'South Africa',
        short_name: 'ZA',
        types: ['country'],
      },
    ],
  };

  // ---------------------------
  // LOCAL UI STATE ONLY
  // ---------------------------
  const [showConfirmDrawer, setShowConfirmDrawer] = useState(false);

  const autocompleteRef = useRef(null);
  const inputElementRef = useRef(null);

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleServiceChange = (e) => {
    setUserService(e.target.value);
  };

  const handleLocationChange = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    setUserLocation({
      address: place.formatted_address,
      placeId: place.place_id,
      addressComponents: place.address_components,
    });
  };

  const handleContinue = () => {
    if (!userService) return;
    if (!userLocation?.address) {
      setUserLocation(MOCK_ADDRESS);
      // ensure state is applied before opening drawer
      setTimeout(() => setShowConfirmDrawer(true), 0);
      return;
    }

    setShowConfirmDrawer(true);
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="service-request-wrapper">
      <div className="service-request-container">
        <h2 className="title">Tell us what you need</h2>
        <p className="paragraph">
          Choose a service and confirm your location to begin your request.
        </p>

        {/* SERVICE SELECT */}

        <ServiceField mode={'request'} />

        {/* LOCATION INPUT */}
        <div className="input-container">
          <LocationIcon width="20" height="20" className="location-icon" />
          {typeof window !== 'undefined' && window.google ? (
            <div className="local">
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handleLocationChange}
                options={{
                  types: ['address'],
                  componentRestrictions: { country: 'za' },
                  bounds: getLatLngBounds(city),
                  strictBounds: false,
                }}
              >
                <input
                  type="text"
                  placeholder="Location"
                  className="location-input pr-5"
                  value={userLocation?.address || ''}
                  onChange={(e) => setUserLocation({ address: e.target.value })}
                  ref={inputElementRef}
                />
              </Autocomplete>
            </div>
          ) : (
            <Input disabled placeholder="Loading address…" />
          )}

          {userLocation?.address && (
            <motion.button
              type="button"
              onClick={() => setUserLocation({ address: '' })}
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
              transition={{ duration: 0.2 }}
              className="clear-location"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* BUTTONS */}
        <div className="req-bottom">
          <button
            className="request-button"
            onClick={handleContinue}
            disabled={!userService}
          >
            Continue
          </button>
        </div>
      </div>

      <div className="image-container service-request-aside">
        <div className="service-request-aside__icon" aria-hidden="true">
          <ShieldCheck strokeWidth={1.8} />
        </div>
        <p className="service-request-aside__eyebrow">How it works</p>
        <h3>Get help without the back-and-forth.</h3>
        <ul>
          <li>
            <MapPin strokeWidth={1.8} />
            <span>Share the address where you need help.</span>
          </li>
          <li>
            <Clock strokeWidth={1.8} />
            <span>Start a request for the service you need today.</span>
          </li>
        </ul>
      </div>

      <RequestDrawer
        mode={'request'}
        open={showConfirmDrawer}
        onOpenChange={setShowConfirmDrawer}
      />
    </div>
  );
}
