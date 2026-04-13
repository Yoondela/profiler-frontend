import { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
import SelectSizePopup from '../modals/GetSizePopup';
import SelectTasksPopup from '../modals/SelectTasksPopup';
import { useServiceBooking } from '../contexts/ServiceBookingContext';
import { RequestDrawer } from '../confirm/confirm';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useCity } from '@/components/city/context/cityContext';
import { getLatLngBounds } from '@/utils/getCityBounds';

export default function ServiceAndAddress({ onNext, onBack, onEdit }) {
  const {
    userService,
    setUserService,
    userLocation,
    setUserLocation,
    setServiceTasks,
  } = useServiceBooking();

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const autocompleteRef = useRef(null);
  const { city } = useCity();
  

  // ---------------------------
  // GOOGLE MAPS LOADER
  // ---------------------------

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // ---------------------------
  // LOCATION HANDLER
  // ---------------------------

  const handleLocationChange = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    setUserLocation({
      address: place.formatted_address,
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

  const goToTasks = () => {
    setShowSizePopup(false);
    setShowTasksPopup(true);
  };

  const handleConfirm = () => {
    setShowTasksPopup(false);
    setShowDrawer(true);
  };

  // ---------------------------
  // VALIDATION
  // ---------------------------

  const isNextDisabled = !userService || !userLocation || !userLocation.address;

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

          {isLoaded && (
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
          )}
        </div>

        {/* BUTTONS */}

        <div className="slider-btns">
          <div className="left-btn">
            <button
              className="request-button"
              onClick={() => setShowSizePopup(true)}
              disabled={isNextDisabled}
            >
              Next
            </button>
          </div>

          <div className="right-btn">
            <button
              className="pref-button small-btn"
              onClick={onEdit}
              disabled={!userService}
            >
              Edit
            </button>

            <button className="back-button small-btn" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* SIZE POPUP */}

      {showSizePopup && (
        <SelectSizePopup
          mode="booking"
          onConfirm={goToTasks}
          onCancel={() => setShowSizePopup(false)}
        />
      )}

      {/* TASK POPUP */}

      {showTasksPopup && (
        <SelectTasksPopup
          service={userService}
          setSelectedTasks={setServiceTasks}
          onCancel={() => setShowTasksPopup(false)}
          onConfirm={() => {
            setShowTasksPopup(false);
            handleConfirm();
            onNext();
          }}
        />
      )}

      {/* CONFIRM DRAWER */}

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
