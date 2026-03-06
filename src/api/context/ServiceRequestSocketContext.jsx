import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { useApiClient } from '../useApiClient';
import { respondToRequest } from '../sync/SyncRequest';

const ServiceRequestContext = createContext(null);

export function ServiceRequestWSProvider({ children }) {
  const { subscribe, send } = useSocket();

  const [activeRequest, setActiveRequest] = useState(null);
  const [requestTaken, setRequestTaken] = useState(false);

  const api = useApiClient();

  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('new_service_request', (payload) => {
      console.log('New service request:', payload);
      setActiveRequest(payload);
    });

    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('request_taken', (payload) => {
      console.log('Request taken:', payload);
      console.log('Request taken:', activeRequest._id);
      setRequestTaken(true);

      if (activeRequest?._id === payload.requestId) {
        setActiveRequest(null);
      }
    });

    return unsubscribe;
  }, [subscribe, activeRequest]);

  // ACCEPT
  const acceptRequest = async () => {
    if (!activeRequest) return;

    await respondToRequest(api, activeRequest._id);

    setActiveRequest(null);
  };

  // IGNORE
  const ignoreRequest = () => {
    if (!activeRequest) return;

    // send('ignore_service_request', {
    //   requestId: activeRequest._id,
    // });

    setActiveRequest(null);
  };

  // CLEAR (UI only)
  const clearRequest = () => {
    setActiveRequest(null);
  };

  return (
    <ServiceRequestContext.Provider
      value={{
        activeRequest,
        requestTaken,
        acceptRequest,
        ignoreRequest,
        clearRequest,
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
}

export function useServiceWSRequest() {
  return useContext(ServiceRequestContext);
}
