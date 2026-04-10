import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import * as notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { socket, setNotificationCount } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getUnreadCount();
      const count = data.count ?? data.unreadCount ?? 0;
      setUnreadCount(count);
      setNotificationCount(count);
    } catch (err) {
      // silently fail
    }
  }, [isAuthenticated, setNotificationCount]);

  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications(params);
      const list = data.notifications || data.data || data;
      setNotifications(Array.isArray(list) ? list : []);
      return data;
    } catch (err) {
      // silently fail
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUnreadCount();
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [isAuthenticated, refreshUnreadCount]);

  useEffect(() => {
    if (socket) {
      const handler = (notification) => {
        setUnreadCount((prev) => prev + 1);
        setNotificationCount((prev) => prev + 1);
        toast(notification?.title || 'New notification', {
          icon: '\uD83D\uDD14',
          duration: 4000,
        });
      };
      socket.on('new_notification', handler);
      return () => socket.off('new_notification', handler);
    }
  }, [socket, setNotificationCount]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      setNotificationCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
