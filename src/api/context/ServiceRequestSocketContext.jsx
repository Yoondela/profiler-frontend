import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { useApiClient } from '../useApiClient';
import { respondToRequest } from '../sync/SyncRequest';

const ServiceRequestContext = createContext(null);

export function ServiceRequestWSProvider({ children }) {
  const { subscribe } = useSocket();
  const api = useApiClient();

  const [requestQueue, setRequestQueue] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);

  const [requestTaken, setRequestTaken] = useState(false);
  const [requestAwarded, setRequestAwarded] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(null);

  // 🔑 Track the current request id independently
  const [currentRequestId, setCurrentRequestId] = useState(null);

  const resolveRequestId = (payload) =>
    payload?.requestId ?? payload?.request?._id ?? payload?._id ?? null;

  /*
  -----------------------------
  NEW SERVICE REQUEST
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('new_service_request', (payload) => {
      console.log('New service request:', payload);

      setRequestAwarded(false);
      setRequestTaken(false);
      setRequestAccepted(null);

      setRequestQueue((prev) => [...prev, payload]);
    });

    return unsubscribe;
  }, [subscribe]);

  /*
  -----------------------------
  REQUEST QUEUE
  -----------------------------
  */
  useEffect(() => {
    if (activeRequest || requestQueue.length === 0) return;

    const nextRequest = requestQueue[0];

    setActiveRequest(nextRequest);
    setCurrentRequestId(nextRequest._id);

    setRequestQueue((prev) => prev.slice(1));
  }, [requestQueue, activeRequest]);

  /*
  -----------------------------
  REQUEST ACCEPTED (USER VIEW)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('request_accepted', (payload) => {
      console.log('Request accepted:', payload);

      setRequestAccepted(payload);
    });

    return unsubscribe;
  }, [subscribe]);

  /*
  -----------------------------
  REQUEST AWARDED (YOU WON)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('request_awarded', (payload) => {
      console.log('Request awarded:', payload);

      if (resolveRequestId(payload) === currentRequestId) {
        setRequestAccepted(null);
        setRequestAwarded(true);
      }
    });

    return unsubscribe;
  }, [subscribe, currentRequestId]);

  /*
  -----------------------------
  REQUEST TAKEN (SOMEONE ELSE)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('request_taken', (payload) => {
      console.log('Request taken:', payload);

      if (resolveRequestId(payload) === currentRequestId) {
        setRequestTaken(true);
        setActiveRequest(null);
      }
    });

    return unsubscribe;
  }, [subscribe, currentRequestId]);

  /*
  -----------------------------
  ACCEPT REQUEST
  -----------------------------
  */
  const acceptRequest = async () => {
    if (!activeRequest) return;

    await respondToRequest(api, activeRequest._id);

    setActiveRequest(null);
  };

  /*
  -----------------------------
  IGNORE REQUEST
  -----------------------------
  */
  const ignoreRequest = () => {
    if (!activeRequest) return;

    setActiveRequest(null);
  };

  /*
  -----------------------------
  CLEAR UI STATE
  -----------------------------
  */
  const clearRequest = () => {
    setActiveRequest(null);
    setRequestTaken(false);
    setRequestAwarded(false);
    setRequestAccepted(null);
  };

  return (
    <ServiceRequestContext.Provider
      value={{
        activeRequest,
        requestTaken,
        requestAwarded,
        requestAccepted,

        setRequestTaken,

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
