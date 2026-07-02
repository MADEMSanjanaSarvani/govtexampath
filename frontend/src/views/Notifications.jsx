import React, { useEffect, useState } from 'react';
import { FiBell, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from '../components/notifications/NotificationList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const typeFilters = [
  { key: '', label: 'All' },
  { key: 'exam_schedule', label: 'Exam Dates' },
  { key: 'hall_ticket', label: 'Hall Tickets' },
  { key: 'result', label: 'Results' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'placement', label: 'Placements' },
  { key: 'fee_reminder', label: 'Fee Reminders' },
  { key: 'general', label: 'General' },
];

const Notifications = () => {
  const { t } = useLanguage();
  const filterLabels = {
    'All': t('notifFilterAll'), 'Exam Dates': t('notifFilterExamDates'), 'Hall Tickets': t('notifFilterHallTickets'),
    'Results': t('notifFilterResults'), 'Announcements': t('notifFilterAnnouncements'), 'Placements': t('notifFilterPlacements'),
    'Fee Reminders': t('notifFilterFeeReminders'), 'General': t('notifFilterGeneral'),
  };
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        await fetchNotifications({ limit: 50, type: activeFilter || undefined });
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [fetchNotifications, activeFilter]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Notifications" path="/notifications" description="Stay updated with the latest exam notifications, deadline reminders, and important announcements from GovtExamPath." />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FiBell className="w-7 h-7 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t('notifTitle')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {unreadCount > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {unreadCount} {unreadCount > 1 ? t('notifUnreadPlural') : t('notifUnread')}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <FiCheckCircle className="w-3.5 h-3.5" /> {t('notifAllCaughtUp')}
                </span>
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <FiCheckCircle className="w-4 h-4" />
            {t('notifMarkAllRead')}
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter by type</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeFilter === f.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterLabels[f.label] || f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
      )}
    </div>
  );
};

export default Notifications;
