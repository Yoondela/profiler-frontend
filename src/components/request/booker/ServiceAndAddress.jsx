import { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
import { useServiceBooking } from '../contexts/ServiceBookingContext';
import { RequestDrawer } from '../confirm/confirm';
import { Autocomplete } from '@react-google-maps/api';
import { useCity } from '@/components/city/context/cityContext';
import { getLatLngBounds } from '@/utils/getCityBounds';

export default function ServiceAndAddress({ onBack }) {
  const { userService, setUserService, userLocation, setUserLocation } =
    useServiceBooking();

  const [showDrawer, setShowDrawer] = useState(false);

  const autocompleteRef = useRef(null);
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
  // LOCATION HANDLER
  // ---------------------------

  const handleLocationChange = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    setUserLocation({
      address: place.formatted_address,
      placeId: place.place_id,
      addressComponents: place.address_components,
    });
  };

  // ---------------------------
  // SERVICE HANDLER
  // ---------------------------

  const handleServiceChange = (e) => {
    setUserService(e.target.value);
  };

  // ---------------------------
  // FLOW CONTROL
  // ---------------------------

  const handleNext = () => {
    if (!userService) return;
    if (!userLocation?.address) setUserLocation(MOCK_ADDRESS);
    setShowDrawer(true);
  };

  // ---------------------------
  // VALIDATION
  // ---------------------------

  const isNextDisabled = !userService;

  return (
    <div className="booker-form-container">
      <div className="service-request-container">
        <h2 className="title">Service And Address</h2>
        <p className="paragraph">What service do you require?</p>

        {/* SERVICE DROPDOWN */}

        <div className="dropdown-container">
          <BriefcaseIcon width="20" height="20" className="briefcase-icon" />

          <select
            className="dropdown"
            value={userService}
            onChange={handleServiceChange}
          >
            <option value="" disabled>
              Select a service
            </option>

            <option value="Cleaning">Cleaning</option>
            <option value="Car Wash">Car Wash</option>
            <option value="Gardening">Gardening</option>
          </select>

          <FaChevronDown className="dropdown-icon" />
        </div>

        {/* LOCATION INPUT */}

        <div className="input-container">
          <LocationIcon width="20" height="20" className="location-icon" />

          {typeof window !== 'undefined' && window.google ? (
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
                className="location-input"
                value={userLocation?.address || ''}
                onChange={(e) =>
                  setUserLocation({
                    address: e.target.value,
                  })
                }
              />
            </Autocomplete>
          ) : (
            <Input disabled placeholder="Loading address…" />
          )}
        </div>

        {/* BUTTONS */}

        <div className="slider-btns">
          <div className="left-btn">
            <button
              className="request-button"
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              Next
            </button>
          </div>

          <div className="right-btn">
            <button className="back-button small-btn" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>

      {showDrawer && (
        <RequestDrawer
          mode="booking"
          open={showDrawer}
          onOpenChange={setShowDrawer}
        />
      )}
    </div>
  );
}
