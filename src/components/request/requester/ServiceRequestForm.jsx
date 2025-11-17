import { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useServiceRequest } from '../contexts/ServiceRequestContext';

import SelectSizePopup from '../modals/GetSizePopup';
import SelectTasksPopup from '../modals/SelectTasksPopup';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';

import { RequestDrawer } from '../confirm/confirm';

import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

export default function ServiceRequestForm({ onEdit, setGoToReview }) {
  // ---------------------------
  // CONTEXT (SOURCE OF TRUTH)
  // ---------------------------
  const {
    userService,
    setUserService,
    userLocation,
    setUserLocation,
    subjectSize,
    setSubjectSize,
    serviceTasks,
    setServiceTasks,
  } = useServiceRequest();

  // ---------------------------
  // LOCAL UI STATE ONLY
  // ---------------------------
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const searchBoxRef = useRef(null);
  const inputElementRef = useRef(null);

  // ---------------------------
  // GOOGLE MAPS LOADER
  // ---------------------------
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleServiceChange = (e) => {
    setUserService(e.target.value);
  };

  const handleLocationChange = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places?.length) return;

    const place = places[0];
    setUserLocation({
      address: place.formatted_address,
    });
  };

  const goToTasks = () => {
    setShowSizePopup(false);
    setShowTasksPopup(true);
  };

  const handleConfirm = () => {
    setShowTasksPopup(false);
    setShowDrawer(true);
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="service-request-wrapper container">
      <div className="service-request-container">
        <h2 className="title">Create Your Service</h2>
        <p className="paragraph">
          Discover the convenience of Exalt. Request a service now, or schedule
          one for later directly from your browser.
        </p>

        {/* SERVICE SELECT */}
        <div className="dropdown-container">
          <BriefcaseIcon width="20" height="20" className="briefcase-icon" />

          <select
            className="dropdown"
            value={userService || ''}
            onChange={handleServiceChange}
          >
            <option value="" disabled>
              Select a service
            </option>
            <option value="Car Wash">Car Wash</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Gardening">Gardening</option>
          </select>

          <FaChevronDown className="dropdown-icon" />
        </div>

        {/* LOCATION INPUT */}
        <div className="input-container">
          <LocationIcon width="20" height="20" className="location-icon" />

          {isLoaded && (
            <div className="local">
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handleLocationChange}
              >
                <input
                  type="text"
                  placeholder="Location"
                  className="location-input pr-5"
                  value={userLocation?.address || ''}
                  onChange={(e) => setUserLocation({ address: e.target.value })}
                  ref={inputElementRef}
                />
              </StandaloneSearchBox>
            </div>
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
            onClick={() => setShowSizePopup(true)}
            disabled={!userService || !userLocation?.address}
          >
            Get
          </button>

          <button
            className="edit-tasks"
            onClick={onEdit}
            disabled={!userService}
          >
            Edit
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="image-container">
        <img
          src="img/homepage/oomakayoza.jpg"
          alt="Service"
          className="service-image"
        />
      </div>

      {/* POPUPS */}
      {showSizePopup && (
        <SelectSizePopup
          mode="request"
          onCancel={() => setShowSizePopup(false)}
          onConfirm={goToTasks}
        />
      )}

      {showTasksPopup && (
        <SelectTasksPopup
          service={userService}
          onCancel={() => setShowTasksPopup(false)}
          onConfirm={() => {
            setShowTasksPopup(false);
            handleConfirm();
          }}
          setSelectedTasks={setServiceTasks}
        />
      )}
      <RequestDrawer open={showDrawer} onOpenChange={setShowDrawer} />
    </div>
  );
}
