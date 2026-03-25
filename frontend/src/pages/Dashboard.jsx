import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiBell, FiFileText, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getBookmarks } from '../services/examService';
import ExamList from '../components/exams/ExamList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount, notifications, fetchNotifications } = useNotifications();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookmarkData] = await Promise.all([
          getBookmarks().catch(() => ({ exams: [] })),
          fetchNotifications({ limit: 5 }),
        ]);
        setBookmarks(bookmarkData.exams || bookmarkData || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchNotifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <FiBookmark className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bookmarked Exams</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bookmarks.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <FiBell className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Unread Notifications</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{unreadCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <FiFileText className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Bookmarks</h2>
          <Link to="/bookmarks" className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ExamList exams={bookmarks.slice(0, 3)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Notifications</h2>
          <Link to="/notifications" className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n._id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
