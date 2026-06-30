import React, { useEffect, useState } from 'react';
import { FiBell, FiFilter } from 'react-icons/fi';
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
    const load = async () => {
      setLoading(true);
      await fetchNotifications({ limit: 50, type: activeFilter || undefined });
      setLoading(false);
    };
    load();
  }, [fetchNotifications, activeFilter]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Notifications" path="/notifications" description="Stay updated with the latest exam notifications, deadline reminders, and important announcements from GovtExamPath." />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <FiBell className="w-8 h-8 text-primary-600" />
            {t('notifTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} ${unreadCount > 1 ? t('notifUnreadPlural') : t('notifUnread')}` : t('notifAllCaughtUp')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            {t('notifMarkAllRead')}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <FiFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {typeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              activeFilter === f.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filterLabels[f.label] || f.label}
          </button>
        ))}
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
