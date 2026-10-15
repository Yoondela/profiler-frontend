import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';
import { useSocket } from './socketContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from './userContext';
import { fetchPortfolioEdits } from '../sync/SyncPortfolio';

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const { subscribe } = useSocket();
  const { getAccessTokenSilently } = useAuth0();
  const { appUser_ID, bootstrapStatus } = useUserContext();

  const [bookings, setBookings] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    let active = true;

    if (bootstrapStatus !== 'ready') {
      setBookings([]);
      setInvites([]);
      setError(null);
      setLoading(bootstrapStatus !== 'anonymous');
      return () => {
        active = false;
      };
    }

    if (!appUser_ID) {
      setBookings([]);
      setInvites([]);
      setError('No provider actions are available for this account.');
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const portfolio = await fetchPortfolioEdits(appUser_ID, token);
        const companyId =
          typeof portfolio.company === 'object'
            ? portfolio.company?._id
            : portfolio.company;
        const businessId = companyId || portfolio._id;

        if (!businessId) {
          throw new Error('No Portfolio action owner found');
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/actions/unresolved/${businessId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data || res.body || {};
        console.log(data);
        if (active) {
          setBookings(data.bookings || []);
          setInvites(data.invites || []);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        if (active) {
          setBookings([]);
          setInvites([]);
          setError('Unable to load actions. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, [appUser_ID, bootstrapStatus, getAccessTokenSilently]);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => {
      const exists = prev.some((b) => b._id === booking._id);
      if (exists) return prev;
      return [booking, ...prev];
    });
    setHasNew(true);
  }, []);

  const replaceBooking = useCallback((updatedBooking) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  }, []);

  const removeBooking = useCallback((bookingId) => {
    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
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
      value={{
        bookings,
        invites,
        loading,
        error,

        hasNew,
        clearNewFlag,

        addBooking,
        replaceBooking,
        removeBooking,
      }}
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
