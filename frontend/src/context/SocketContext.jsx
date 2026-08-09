import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);
  // State-tracked socket so consumers re-render when the connection is established
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    // Only connect socket if a real backend URL is configured (not localhost on production)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const hasBackend = apiUrl && !apiUrl.includes('localhost');

    if (isAuthenticated && (!isProduction || hasBackend)) {
      const socketUrl = apiUrl
        ? apiUrl.replace('/api', '')
        : 'http://localhost:5000';

      try {
        // No client-readable token to send anymore (session is an httpOnly
        // cookie) — withCredentials lets the handshake carry it instead, for
        // whenever the server actually starts checking it (it currently
        // doesn't gate anything on this at the transport level).
        const sock = io(socketUrl, {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnectionAttempts: 3,
        });
        socketRef.current = sock;
        setSocketInstance(sock);

        sock.on('connect', () => {});

        sock.on('online_users', (users) => {
          setOnlineUsers(users);
        });

        sock.on('connect_error', (err) => {
          console.warn('[GovtExamPath] Socket connection error:', err.message);
        });

        sock.on('disconnect', () => {});
      } catch (err) {
        console.error('[GovtExamPath] Socket init error:', err);
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocketInstance(null);
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
      }
      setNotificationCount(0);
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        onlineUsers,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
