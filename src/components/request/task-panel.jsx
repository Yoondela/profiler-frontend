import { useState, useEffect } from 'react';
import { useServiceRequest } from './contexts/ServiceRequestContext';
import HouseCleaningTasks from './pickers/CleaningTasks';
import CarWashTasks from './pickers/CarWashTasks';
import GardeningTasks from './pickers/GardeningTaks';
import SelectSizePopup from './modals/GetSizePopup';

const allServices = ['Cleaning', 'Car Wash', 'Gardening'];

export default function TaskPanel({ onClosePanel, setTasks }) {
  const { userService, setServiceTasks } = useServiceRequest();
  const defaultService = userService;

  const [selectedCategory, setSelectedCategory] = useState(
    defaultService || null
  );
  const [services, setServices] = useState(
    defaultService ? [defaultService] : []
  );
  const [addAnotherService, setAddAnotherService] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState(null);
  const [getSize, setGetSize] = useState(false);
  const [serviceWaitingForSize, setServiceWaitingForSize] = useState(null);
  const [tempSize, setTempSize] = useState(null);
  const [serviceSizes, setServiceSizes] = useState({});

  console.log('We outside: ', tempSize);
  const [selectedTasks, setSelectedTasks] = useState({
    Cleaning: [],
    'Car Wash': [],
    Gardening: [],
  });

  useEffect(() => {
    if (defaultService && !services.includes(defaultService)) {
      setServices((prev) => [...prev, defaultService]);
      setSelectedCategory(defaultService);
    }
  }, [defaultService, services]);

  const handleServiceClick = (service) => {
    if (!serviceSizes[service]) {
      // No size selected for this service yet
      setServiceWaitingForSize(service); // Remember which service needs size
      setGetSize(true); // Open size popup
    }
    setSelectedCategory(service); // Still select the service
  };

  const updateSize = () => {
    if (tempSize) {
      console.log('Hold size is:', tempSize);
      setServiceSizes((prev) => ({
        ...prev,
        [serviceWaitingForSize]: tempSize,
      }));
      setGetSize(false);
      setServiceWaitingForSize(null);
      setTempSize(null);
    }
  };

  const handleConfirm = () => {
    const filteredTasks = Object.entries(selectedTasks)
      .filter(([_, tasks]) => tasks.length > 0)
      .reduce((acc, [service, tasks]) => {
        acc[service] = tasks;
        return acc;
      }, {});

    const selectedServices = Object.keys(filteredTasks);

    const finalPayload = {
      services: selectedServices.map((service) => ({
        type: service,
        objectSize: serviceSizes[service] || null,
      })),
      tasks: filteredTasks,
    };

    setTasks(finalPayload);
    setServiceTasks(finalPayload);
    setConfirmSave(false);
    onClosePanel();
  };

  const addService = (service) => {
    if (!services.includes(service)) {
      setServices((prev) => [...prev, service]);
    }
    setAddAnotherService(false);
  };

  const updateSelectedTasks = (category, tasks) => {
    setSelectedTasks((prev) => ({
      ...prev,
      [category]: tasks,
    }));
  };

  const confirmRemoveService = (service) => {
    setServiceToRemove(service);
    setConfirmDelete(true);
  };

  const removeService = () => {
    if (serviceToRemove) {
      setServices((prev) => prev.filter((s) => s !== serviceToRemove));
      setSelectedTasks((prev) => ({
        ...prev,
        [serviceToRemove]: [],
      }));
      if (selectedCategory === serviceToRemove) {
        setSelectedCategory(null);
      }
    }
    setConfirmDelete(false);
    setServiceToRemove(null);
  };

  return (
    <div className="tasks-container">
      <div className="task-panel-content">
        {/* Left Panel */}
        <div className="left-panel">
          <h2 className="heading">Your Service</h2>

          <div className="left-main">
            <ul className="service-list">
              {services.map((service) => (
                <li
                  key={service}
                  className={`service-item ${selectedCategory === service ? 'active' : ''}`}
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="service-item-and-remove">
                    <span>{service}</span>
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmRemoveService(service);
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              className="add-btn"
              onClick={() => setAddAnotherService(true)}
            >
              <span>+</span> Add Service
            </button>
          </div>

          <button className="confirm-btn" onClick={() => setConfirmSave(true)}>
            Done
          </button>
        </div>

        {/* Right Panel */}
        <div className="right-panel flex">
          {selectedCategory === 'Cleaning' && (
            <HouseCleaningTasks
              selectedTasks={selectedTasks.Cleaning}
              setSelectedTasks={(tasks) =>
                updateSelectedTasks('Cleaning', tasks)
              }
            />
          )}
          {selectedCategory === 'Car Wash' && (
            <CarWashTasks
              selectedTasks={selectedTasks['Car Wash']}
              setSelectedTasks={(tasks) =>
                updateSelectedTasks('Car Wash', tasks)
              }
            />
          )}
          {selectedCategory === 'Gardening' && (
            <GardeningTasks
              selectedTasks={selectedTasks.Gardening}
              setSelectedTasks={(tasks) =>
                updateSelectedTasks('Gardening', tasks)
              }
            />
          )}
          {!selectedCategory && (
            <p className="placeholder-text">Select a service to see tasks</p>
          )}

          <button className="close-task-panel" onClick={onClosePanel}>
            ❌
          </button>
        </div>
      </div>

      {/* Popups */}
      {getSize && serviceWaitingForSize && (
        <SelectSizePopup
          service={serviceWaitingForSize}
          setSelectedSize={setTempSize}
          selectedSize={tempSize}
          onConfirm={updateSize}
          onCancel={() => {
            setGetSize(false);
            setServiceWaitingForSize(null);
          }}
        />
      )}

      {addAnotherService && (
        <Popup
          title="Select a Service"
          onClose={() => setAddAnotherService(false)}
        >
          <ul className="popup-list">
            {allServices.map((service) => (
              <li
                key={service}
                className="popup-item"
                onClick={() => addService(service)}
              >
                {service}
              </li>
            ))}
          </ul>
        </Popup>
      )}

      {confirmDelete && (
        <Popup title="Remove Service" onClose={() => setConfirmDelete(false)}>
          <p>
            Are you sure you want to remove <strong>{serviceToRemove}</strong>?
          </p>
          <div className="popup-actions">
            <button className="confirm-remove" onClick={removeService}>
              Remove
            </button>
          </div>
        </Popup>
      )}

      {confirmSave && (
        <Popup title="Save" onClose={() => setConfirmSave(false)}>
          <p>Save changes and close editor?</p>
          <div className="popup-actions">
            <button className="confirm-remove" onClick={handleConfirm}>
              Yes
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}

/* Reusable Popup Component */
function Popup({ title, children, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="closer">
          <button className="popup-close" onClick={onClose}>
            ❌
          </button>
        </div>
        <div className="popup-center">
          <div className="popup-header">
            <h2 className="popup-title">{title}</h2>
          </div>
          <div className="popup-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
