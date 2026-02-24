import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';
import { useUserContext } from './userContext';
import { useSocket } from './socketContext';
import { useAuth0 } from '@auth0/auth0-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useUserContext();
  const { getAccessTokenSilently } = useAuth0();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNew, setHasNew] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const token = await getAccessTokenSilently();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, getAccessTokenSilently]);

  // Add notification (exposed function)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n._id === notification._id);
      if (exists) return prev;
      return [notification, ...prev];
    });
    setHasNew(true);
  }, []);

  const clearNewFlag = () => {
    setHasNew(false);
  };

  // Listen to socket
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addNotification(data);
    };
  }, [socket, addNotification]);

  // Mark as read (FIXED token issue)
  const markAsRead = useCallback(
    async (id) => {
      try {
        const token = await getAccessTokenSilently();

        await axios.patch(
          `${import.meta.env.VITE_API_URL}/notifications/${id}/update/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, status: 'read' } : n))
        );
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    },
    [getAccessTokenSilently]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        markAsRead,
        addNotification,
        hasNew,
        clearNewFlag,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('Must use inside NotificationProvider');
  return context;
};
