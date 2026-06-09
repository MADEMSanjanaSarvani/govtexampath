import React from 'react';
import { FiBell, FiCalendar, FiFileText, FiAward, FiDollarSign, FiBriefcase, FiInfo } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../common/EmptyState';

const typeConfig = {
  exam_schedule: { icon: FiCalendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Exam Schedule' },
  hall_ticket: { icon: FiFileText, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'Hall Ticket' },
  result: { icon: FiAward, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Result' },
  assignment: { icon: FiFileText, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'Assignment' },
  fee_reminder: { icon: FiDollarSign, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Fee Reminder' },
  placement: { icon: FiBriefcase, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: 'Placement' },
  announcement: { icon: FiInfo, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: 'Announcement' },
  new_exam: { icon: FiCalendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'New Exam' },
  update: { icon: FiInfo, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Update' },
  reminder: { icon: FiBell, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'Reminder' },
  general: { icon: FiBell, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700', label: 'General' },
};

const priorityBadge = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  normal: '',
  low: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

const NotificationList = ({ notifications = [], onMarkAsRead }) => {
  const formatTime = (date) => {
    if (!date) return '';
    try { return formatDistanceToNow(new Date(date), { addSuffix: true }); } catch { return ''; }
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
      {notifications.map((n) => {
        const config = typeConfig[n.type] || typeConfig.general;
        const Icon = config.icon;
        const isUnread = !n.read && !n.isRead;

        return (
          <div
            key={n._id}
            onClick={() => isUnread && onMarkAsRead && onMarkAsRead(n._id)}
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-all ${
              isUnread ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/5' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</h4>
                  {isUnread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                  {n.priority && n.priority !== 'normal' && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityBadge[n.priority]}`}>
                      {n.priority.charAt(0).toUpperCase() + n.priority.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                <span className="text-xs text-gray-400 mt-1 block">{formatTime(n.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
