import React from 'react';
import { FiBell } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../common/EmptyState';

const NotificationList = ({ notifications = [], onMarkAsRead }) => {
  const formatTime = (date) => {
    if (!date) return '';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  if (!notifications.length) {
    return (
      <EmptyState
        icon={FiBell}
        title="No notifications"
        description="You're all caught up! No notifications at this time."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n._id}
          onClick={() => !n.read && onMarkAsRead && onMarkAsRead(n._id)}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-all ${
            !n.read ? 'border-l-4 border-l-primary-500' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</h4>
                {!n.read && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(n.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
