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
  const { token, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect socket if a real backend URL is configured (not localhost on production)
    const apiUrl = process.env.REACT_APP_API_URL;
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const hasBackend = apiUrl && !apiUrl.includes('localhost');

    if (isAuthenticated && token && (!isProduction || hasBackend)) {
      const socketUrl = apiUrl
        ? apiUrl.replace('/api', '')
        : 'http://localhost:5000';

      socketRef.current = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 3,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      socketRef.current.on('new_notification', () => {
        setNotificationCount((prev) => prev + 1);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotificationCount(0);
    }
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
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
