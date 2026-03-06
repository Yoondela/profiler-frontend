import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';

const ServiceBookingContext = createContext();

export const ServiceBookingProvider = ({ children }) => {
  //TODO: use reducer for better state management as the form grows
  // and use steps.
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [userId, setUserId] = useState(null);

  const [userDate, setUserDate] = useState('');
  const [userTime, setUserTime] = useState('');
  const [userService, setUserService] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [subjectSize, setSubjectSize] = useState('');
  const [serviceTasks, setServiceTasks] = useState(null);
  const [userNote, setUserNote] = useState('');

  useEffect(() => {
    const getClient = async () => {
      if (!isAuthenticated || !user) return;

      const clientId = await getUserID(getAccessTokenSilently, user.email);

      console.log('Client ID:', clientId);

      setUserId(clientId);
    };

    getClient();
  }, [user, isAuthenticated]);

  // safe task parsing
  let job = JSON.stringify(serviceTasks || {});

  console.log('@Context', job);

  const requestData = {
    service: userService,
    location: userLocation,
    selectedSize: subjectSize,
    todo: job,
  };

  const bookingPayload = {
    client: userId,
    service: userService,
    description: JSON.stringify(serviceTasks || {}),
    forDate: userDate,
    forTime: userTime,
    forAddress: userLocation,
    note: userNote || '',
    selectedSize: subjectSize,
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
        bookingPayload,

        note: userNote,
        setNote: setUserNote,
      }}
    >
      {children}
    </ServiceBookingContext.Provider>
  );
};

export const useServiceBooking = () => useContext(ServiceBookingContext);
