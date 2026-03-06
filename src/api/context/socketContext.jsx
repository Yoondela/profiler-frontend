import { createContext, useContext, useEffect, useRef } from 'react';
import { useUserContext } from './userContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useUserContext();
  const socketRef = useRef(null);
  const listenersRef = useRef({});

  // Important: build event queuing system.
  // Make event constants to avoid typos.
  // Guard against unknown events.
  // Prevents errors if no one is listening.

  useEffect(() => {
    if (!user?._id) return;

    const ws = new WebSocket(`ws://localhost:4001/ws/${user._id}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Socket connected');
    };

    ws.onclose = () => {
      console.log('Socket disconnected');
    };

    ws.onmessage = (event) => {
      console.log('New message', event.data);
      console.log(typeof event.data);

      let data;

      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error('JSON parse failed:', err);
        console.log('Raw socket message:', event.data);
        return;
      }

      const eventType = data.eventType || data.event;
      console.log('done 1');

      const payload = data.payload;

      console.log('done 2');

      const listeners = listenersRef.current[eventType];

      console.log('____________', listeners);

      if (!listeners) return;

      listeners.forEach((cb) => cb(payload));
    };

    return () => ws.close();
  }, [user]);

  const subscribe = (event, callback) => {
    if (!listenersRef.current[event]) {
      listenersRef.current[event] = [];
    }

    listenersRef.current[event].push(callback);

    return () => {
      listenersRef.current[event] = listenersRef.current[event].filter(
        (cb) => cb !== callback
      );
    };
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        subscribe,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
