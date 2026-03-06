import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';

const ServiceRequestContext = createContext();

export const ServiceRequestProvider = ({ children }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [userId, setUserId] = useState(null);

  const [userService, setUserService] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [subjectSize, setSubjectSize] = useState('');
  const [serviceTasks, setServiceTasks] = useState(null);
  const [userNote, setUserNote] = useState(null);

  useEffect(() => {
    const getClient = async () => {
      if (!isAuthenticated || !user) return;

      const clientId = await getUserID(getAccessTokenSilently, user.email);

      console.log('Client ID:', clientId);

      setUserId(clientId);
    };

    getClient();
  }, [user, isAuthenticated]);

  let job = JSON.stringify(serviceTasks || {});

  console.log('@Context', job);
  const requestPayload = {
    client: userId,
    service: userService,
    description: JSON.stringify(serviceTasks || {}),
    forAddress: userLocation,
    note: userNote || '',
    selectedSize: subjectSize,
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
        requestPayload,
        setNote: setUserNote,
        note: userNote,
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => useContext(ServiceRequestContext);
