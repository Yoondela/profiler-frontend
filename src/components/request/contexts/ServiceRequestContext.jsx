import { createContext, useContext, useState } from 'react';

const ServiceRequestContext = createContext();

export const ServiceRequestProvider = ({ children }) => {
  const [userService, setUserService] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [subjectSize, setSubjectSize] = useState('');
  const [serviceTasks, setServiceTasks] = useState(null);

  let job = {};
  if (typeof serviceTasks === 'string' && serviceTasks.trim() !== '') {
    try {
      job = JSON.parse(serviceTasks);
    } catch (error) {
      console.error('Invalid JSON format in serviceTasks:', error);
    }
  } else if (typeof serviceTasks === 'object' && serviceTasks !== null) {
    job = serviceTasks;
  }

  console.log('@Context', job);
  const requestData = {
    service: userService,
    location: userLocation,
    selectedSize: subjectSize,
    todo: job,
  };

  return (
    <ServiceRequestContext.Provider
      value={{
        userService,
        setUserService,
        userLocation,
        setUserLocation,
        subjectSize,
        setSubjectSize,
        serviceTasks,
        setServiceTasks,
        requestData,
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => useContext(ServiceRequestContext);
