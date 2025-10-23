import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
// import CleaningTasksChecklist from '../pickers/CleaningTasks';
import BriefcaseIcon from '../../../assets/icons/other/briefcase.svg?react';
import LocationIcon from '../../../assets/icons/other/location.svg?react';
// import TaskPanel from '../request-service/task-panel';
import SelectSizePopup from '../modals/GetSizePopup';
import SelectTasksPopup from '../modals/SelectTasksPopup';
import { set } from 'date-fns';

export default function ServiceAndAddress({
  onNext,
  onBack,
  onEdit,
  setUserService,
  userService,
  setUserLocation,
  userLocation,
}) {
  const [service, setService] = useState(userService || '');
  const [location, setLocation] = useState(userLocation || '');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});

  const handleServiceChange = (e) => {
    setUserService(e.target.value);
    setService(e.target.value);
  };

  const handleLocationChange = (e) => {
    setUserLocation(e.target.value);
    setLocation(e.target.value);
  };

  const showInputs = () => {
    alert(service + '|' + location);
  };

  const goToTasks = () => {
    setShowSizePopup(false);
    setShowTasksPopup(true);
  };

  return (
    <div className="booker-form-container">
      <div className="service-request-container">
        <h2 className="title">Service And Address</h2>
        <p className="paragraph">What service do you require ?</p>

        <div className="dropdown-container">
          <BriefcaseIcon width="20" height="20" className="briefcase-icon" />
          <select
            className="dropdown"
            placeholder="pick service"
            value={service}
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
            value={userLocation}
            onChange={handleLocationChange}
          />
        </div>
        <div className="slider-btns">
          <div className="left-btn">
            <button
              className="request-button"
              onClick={() => setShowSizePopup(true)}
              disabled={!service || !location}
            >
              Next
            </button>
          </div>
          <div className="right-btn">
            <button
              className="pref-button small-btn"
              onClick={onEdit}
              disabled={!service}
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
          service={service}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onConfirm={goToTasks}
          onCancel={() => setShowSizePopup(false)}
        />
      )}
      {showTasksPopup && (
        <SelectTasksPopup
          service={service}
          onCancel={() => setShowTasksPopup(false)}
          onConfirm={() => {
            setShowTasksPopup(false);
            onNext();
          }}
          setSelectedTasks={setSelectedTasks}
        />
      )}
    </div>
  );
}
