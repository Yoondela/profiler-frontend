import { createContext, useContext, useState } from 'react';

const ServiceBookingContext = createContext();

export const ServiceBookingProvider = ({ children }) => {
  const [userDate, setUserDate] = useState('');
  const [userTime, setUserTime] = useState('');
  const [userService, setUserService] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [subjectSize, setSubjectSize] = useState('');
  const [serviceTasks, setServiceTasks] = useState(null);
  const [userNote, setUserNote] = useState('');

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
    <ServiceBookingContext.Provider
      value={{
        userDate,
        setUserDate,
        userTime,
        setUserTime,
        userService,
        setUserService,
        userLocation,
        setUserLocation,
        subjectSize,
        setSubjectSize,
        serviceTasks,
        setServiceTasks,
        requestData,
        userNote,
        setUserNote,
      }}
    >
      {children}
    </ServiceBookingContext.Provider>
  );
};

export const useServiceBooking = () => useContext(ServiceBookingContext);
