import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
import SelectSizePopup from '../modals/GetSizePopup';
import SelectTasksPopup from '../modals/SelectTasksPopup';
import { useServiceBooking } from '../contexts/ServiceBookingContext';

export default function ServiceAndAddress({ onNext, onBack, onEdit }) {
  const {
    userService,
    setUserService,
    userLocation,
    setUserLocation,
    subjectSize,
    setSubjectSize,
    serviceTasks,
    setServiceTasks,
  } = useServiceBooking();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);

  const handleServiceChange = (e) => setUserService(e.target.value);
  const handleLocationChange = (e) => setUserLocation(e.target.value);

  const goToTasks = () => {
    setShowSizePopup(false);
    setShowTasksPopup(true);
  };

  return (
    <div className="booker-form-container">
      <div className="service-request-container">
        <h2 className="title">Service And Address</h2>
        <p className="paragraph">What service do you require?</p>

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

        <div className="input-container">
          <LocationIcon width="20" height="20" className="location-icon" />
          <input
            type="text"
            placeholder="Location"
            className="location-input"
            value={userLocation || ''}
            onChange={handleLocationChange}
          />
        </div>

        <div className="slider-btns">
          <div className="left-btn">
            <button
              className="request-button"
              onClick={() => setShowSizePopup(true)}
              disabled={!userService || !userLocation}
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

      {showSizePopup && (
        <SelectSizePopup
          service={userService}
          selectedSize={subjectSize}
          setSelectedSize={setSubjectSize}
          onConfirm={goToTasks}
          onCancel={() => setShowSizePopup(false)}
        />
      )}

      {showTasksPopup && (
        <SelectTasksPopup
          service={userService}
          onCancel={() => setShowTasksPopup(false)}
          onConfirm={() => {
            setShowTasksPopup(false);
            onNext();
          }}
          setSelectedTasks={setServiceTasks}
        />
      )}
    </div>
  );
}
