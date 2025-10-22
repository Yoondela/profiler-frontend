import { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import { ServiceRequestProvider } from '../contexts/ServiceRequestContext';
import { useServiceRequest } from '../contexts/ServiceRequestContext';

import SelectSizePopup from '../modals/GetSizePopup';
import SelectTasksPopup from '../modals/SelectTasksPopup';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
import PlHolderIcon from '../../../assets/icons/booking-process-icons/file-config-svgrepo-com.svg?react';
import RequestReview from './Review';

// Icons
import CarSmallIcon from '../../../assets/icons/subject-size/car/small-car.svg?react';
import CarLargeIcon from '../../../assets/icons/subject-size/car/mid-car-suv.svg?react';
import CarXLIcon from '../../../assets/icons/subject-size/car/large-car.svg?react';

import Clean1Icon from '../../../assets/icons/subject-size/house/small-house-3.svg?react';
import Clean2Icon from '../../../assets/icons/subject-size/house/small-house.svg?react';
import Clean3Icon from '../../../assets/icons/subject-size/house/mid-house.svg?react';

import GardenSmallIcon from '../../../assets/icons/subject-size/field/numeric-1.svg?react';
import GardenMediumIcon from '../../../assets/icons/subject-size/field/numeric-2.svg?react';
import GardenLargeIcon from '../../../assets/icons/subject-size/field/numeric-3.svg?react';

import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

export default function ServiceRequestForm({ onEdit, setGoToReview }) {
  const {
    userService,
    setUserService,
    userLocation,
    setUserLocation,
    subjectSize,
    setSubjectSize,
  } = useServiceRequest();

  const [service, setService] = useState(userService || '');
  const [location, setLocation] = useState(userLocation?.address || '');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});

  const searchBoxRef = useRef(null);
  const inputElementRef = useRef(null);

  const sizeOptions = {
    'Car Wash': ['SM', 'L', 'XL'],
    Cleaning: ['1 Bed', '2-3 Bed', '4+ Beds'],
    Gardening: ['1-3 M', '4-5 M', '5+ M'],
  };

  const serviceIcons = {
    'Car Wash': [CarSmallIcon, CarLargeIcon, CarXLIcon],
    Cleaning: [Clean1Icon, Clean2Icon, Clean3Icon],
    Gardening: [GardenSmallIcon, GardenMediumIcon, GardenLargeIcon],
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAjjxir_ES4r7sWHnatfTYQ-9Ogzb9FIwY',
    libraries: ['places'],
  });

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setService(value);
    setUserService(value);
  };

  const goToTasks = () => {
    setConfirmRequest(false);
    setShowTasksPopup(true);
  };

  const handleLocationChange = () => {
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const locationData = {
      address: place.formatted_address,
    };

    setLocation(locationData.address);
    setUserLocation(locationData);
  };

  const selectedIcons = serviceIcons[service] || [];

  return (
    <div className="service-request-wrapper container">
      <div className="service-request-container">
        <h2 className="title">Create Your Service</h2>
        <p className="paragraph">
          Discover the convenience of Exalt. Request a service now, or schedule
          one for later directly from your browser.
        </p>

        <div className="dropdown-container">
          <BriefcaseIcon width="20" height="20" className="briefcase-icon" />
          <select
            className="dropdown"
            value={service}
            onChange={handleServiceChange}
          >
            <option value="" disabled>
              Select a service
            </option>
            {Object.keys(sizeOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <FaChevronDown className="dropdown-icon" />
        </div>

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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} // optional: since you're using Google’s `onPlacesChanged` instead
                  ref={inputElementRef}
                />
              </StandaloneSearchBox>
            </div>
          )}

          {location && (
            <motion.button
              type="button"
              onClick={() => {
                setLocation('');
                setUserLocation('');
              }}
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

        <div className="req-bottom">
          <button
            className="request-button"
            onClick={() => setConfirmRequest(true)}
            disabled={!service || !location}
          >
            Get
          </button>
          <button className="edit-tasks" onClick={onEdit} disabled={!service}>
            Edit
          </button>
        </div>
      </div>

      <div className="image-container">
        <img
          src="img/homepage/oomakayoza.jpg"
          alt="Service"
          className="service-image"
        />
      </div>

      {confirmRequest && (
        <SelectSizePopup
          service={service}
          selectedSize={subjectSize}
          setSelectedSize={setSubjectSize}
          onCancel={() => setConfirmRequest(false)}
          onConfirm={goToTasks}
        />
      )}
      {showTasksPopup && (
        <SelectTasksPopup
          service={service}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          onCancel={() => setShowTasksPopup(false)}
          onConfirm={() => setShowTasksPopup(false)}
        />
      )}
    </div>
  );
}
