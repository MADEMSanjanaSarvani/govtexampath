import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@/lib/router';
import { FiBell, FiCalendar, FiFileText, FiAward, FiDollarSign, FiBriefcase, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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

const NotificationBell = () => {
  const { unreadCount, notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!open) fetchNotifications({ limit: 7 });
    setOpen(!open);
  };

  const handleClickNotification = async (n) => {
    if (!n.read && !n.isRead) await markAsRead(n._id);
    setOpen(false);
  };

  const formatTime = (date) => {
    if (!date) return '';
    try { return formatDistanceToNow(new Date(date), { addSuffix: true }); } catch { return ''; }
  };

  const getTypeConfig = (type) => typeConfig[type] || typeConfig.general;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <FiCheckCircle className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FiBell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 7).map((n) => {
                  const config = getTypeConfig(n.type);
                  const Icon = config.icon;
                  const isUnread = !n.read && !n.isRead;

                  return (
                    <button
                      key={n._id}
                      onClick={() => handleClickNotification(n)}
                      className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium line-clamp-1 ${isUnread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                              {n.title}
                            </p>
                            {isUnread && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-[10px] text-gray-400">{formatTime(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 transition-colors"
            >
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
