import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { usePortfolioContext } from './portfolioContext';
import { useSocket } from './socketContext';
import { useAuth0 } from '@auth0/auth0-react';

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const { portfolioDataCtx } = usePortfolioContext();
  const { subscribe } = useSocket();
  const { getAccessTokenSilently } = useAuth0();

  const [bookings, setBookings] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNew, setHasNew] = useState(false);

  const businessId = portfolioDataCtx?.company?._id || portfolioDataCtx?.portfolio?.id;

  console.log('BusinessId in booking context = ', businessId)

  useEffect(() => {
    if (!businessId) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/actions/unresolved/${businessId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data || res.body || {};
        console.log(data)
        setBookings(data.bookings || []);
        setInvites(data.invites || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [businessId, getAccessTokenSilently]);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => {
      const exists = prev.some((b) => b._id === booking._id);
      if (exists) return prev;
      return [booking, ...prev];
    });
    setHasNew(true);
  }, []);

  const clearNewFlag = () => setHasNew(false);

  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('new_direct_booking', (payload) => {
      addBooking(payload);
    });

    return unsubscribe;
  }, [subscribe, addBooking]);

  return (
    <BookingsContext.Provider
      value={{ bookings, invites, loading, hasNew, clearNewFlag, addBooking }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
};

export default BookingsContext;
