import { createContext, useContext, useEffect, useRef } from 'react';
import { useUserContext } from './userContext';
import { toast } from 'sonner';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useUserContext();
  const socketRef = useRef(null);
  console.log('SocketProvider mounted');

  console.log('Establishing socket connection for user:', user);

  useEffect(() => {
    if (!user?._id) return;

    if (socketRef.current) return; // prevent duplicate in strict mode

    const ws = new WebSocket(`ws://localhost:4001/ws/${user._id}`);

    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Socket connected');
    };

    ws.onclose = () => {
      console.log('Socket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
