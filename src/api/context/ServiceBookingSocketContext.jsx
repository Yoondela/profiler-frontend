import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { useApiClient } from '../useApiClient';
import { respondToBooking } from '../sync/SyncBooking';

const ServiceBookingContext = createContext(null);

export function ServiceBookingWSProvider({ children }) {
  const { subscribe } = useSocket();
  const api = useApiClient();

  const [bookingCreated, setBookingCreated] = useState(null);

  const [bookingQueue, setBookingQueue] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  const [bookingTaken, setBookingTaken] = useState(false);
  const [bookingAwarded, setBookingAwarded] = useState(null);
  const [bookingAccepted, setBookingAccepted] = useState(null);

  // 🔑 Track the current booking id independently
  const [currentBookingId, setCurrentBookingId] = useState(null);

  const resolveBookingId = (payload) =>
    payload?.bookingId ?? payload?.booking?._id ?? payload?._id ?? null;

  /*
  -----------------------------
  SERVICE BOOKING CREATED
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('service_booking_created', (payload) => {
      console.log('Booking created:', payload);

      setBookingCreated(payload);
      setBookingAwarded(null);
      setBookingTaken(false);
      setBookingAccepted(null);
    });

    return unsubscribe;
  }, [subscribe]);

  /*
  -----------------------------
  NEW SERVICE BOOKING
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('new_service_booking', (payload) => {
      console.log('New service booking:', payload);

      setBookingAwarded(null);
      setBookingTaken(false);
      setBookingAccepted(null);

      setBookingQueue((prev) => [...prev, payload]);
    });

    return unsubscribe;
  }, [subscribe]);

  /*
  -----------------------------
  BOOKING QUEUE, New bookings are addrd to the queue
  -----------------------------
  */
  useEffect(() => {
    if (activeBooking || bookingQueue.length === 0) return;

    const nextBooking = bookingQueue[0];

    setActiveBooking(nextBooking);
    setCurrentBookingId(nextBooking._id);

    setBookingQueue((prev) => prev.slice(1));
  }, [bookingQueue, activeBooking]);

  /*
  -----------------------------
  BOOKING ACCEPTED (USER VIEW)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('booking_accepted', (payload) => {
      console.log('Booking accepted:', payload);

      setBookingAccepted(payload);
      setBookingCreated(null);
    });

    return unsubscribe;
  }, [subscribe]);

  /*
  -----------------------------
  BOOKING AWARDED (YOU WON)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('booking_awarded', (payload) => {
      console.log('Booking awarded:', payload);

      if (resolveBookingId(payload) === currentBookingId) {
        setBookingAccepted(null);
        setBookingAwarded(payload);
      }
    });

    return unsubscribe;
  }, [subscribe, currentBookingId]);

  /*
  -----------------------------
  BOOKING TAKEN (SOMEONE ELSE)
  -----------------------------
  */
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('booking_taken', (payload) => {
      console.log('Booking taken:', payload);

      if (resolveBookingId(payload) === currentBookingId) {
        setBookingTaken(true);
        setActiveBooking(null);
      }
    });

    return unsubscribe;
  }, [subscribe, currentBookingId]);

  /*
  -----------------------------
  ACCEPT BOOKING
  -----------------------------
  */
  const acceptBooking = async () => {
    if (!activeBooking) return;

    await respondToBooking(api, activeBooking._id);

    setActiveBooking(null);
  };

  /*
  -----------------------------
  IGNORE BOOKING
  -----------------------------
  */
  const ignoreBooking = () => {
    if (!activeBooking) return;

    setActiveBooking(null);
  };

  /*
  -----------------------------
  CLEAR UI STATE
  -----------------------------
  */
  const clearBooking = () => {
    setActiveBooking(null);
    setBookingCreated(null);
    setBookingTaken(false);
    setBookingAwarded(null);
    setBookingAccepted(null);
  };

  return (
    <ServiceBookingContext.Provider
      value={{
        activeBooking,
        bookingCreated,
        bookingTaken,
        bookingAwarded,
        bookingAccepted,

        setBookingTaken,

        acceptBooking,
        ignoreBooking,
        clearBooking,
      }}
    >
      {children}
    </ServiceBookingContext.Provider>
  );
}

export function useServiceWSBooking() {
  return useContext(ServiceBookingContext);
}
