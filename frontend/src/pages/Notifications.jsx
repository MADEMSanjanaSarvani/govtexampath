import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from '../components/notifications/NotificationList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Notifications = () => {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchNotifications({ limit: 50 });
      setLoading(false);
    };
    load();
  }, [fetchNotifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>
      <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
    </div>
  );
};

export default Notifications;
