import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiBell, FiCpu, FiCheckSquare, FiArrowRight, FiCalendar, FiTrendingUp, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getBookmarks, getExams } from '../services/examService';
import ExamList from '../components/exams/ExamList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount, notifications, fetchNotifications } = useNotifications();
  const [bookmarks, setBookmarks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [bookmarkData, recData] = await Promise.all([
        getBookmarks().catch(() => ({ exams: [] })),
        getExams({ limit: 4, sort: '-createdAt' }).catch(() => ({ exams: [] })),
      ]);
      fetchNotifications({ limit: 5 }).catch(() => {});
      setBookmarks(bookmarkData.exams || bookmarkData || []);
      setRecommended(recData.exams || recData || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Unable to load your dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            There was a problem connecting to the server. This usually happens when the backend service is unavailable.
          </p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-blue-100/80 max-w-lg">
            Continue your exam preparation journey. Check your bookmarked exams, explore new opportunities, and stay updated with the latest notifications.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FiBookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{bookmarks.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Saved Exams</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <FiBell className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{unreadCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">New Notifications</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">Active</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{recommended.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest Exams</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link to="/ai-guide" className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiCpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">AI Career Guide</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get personalized exam recommendations</p>
          </div>
          <FiArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to="/eligibility-checker" className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiCheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors">Eligibility Checker</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check which exams you qualify for</p>
          </div>
          <FiArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recommended Exams */}
      {recommended.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recommended Exams</h2>
            <Link to="/exams" className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ExamList exams={recommended.slice(0, 4)} />
        </div>
      )}

      {/* Recent Bookmarks */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Bookmarks</h2>
          <Link to="/bookmarks" className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {bookmarks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <FiBookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No bookmarked exams yet. Browse exams and bookmark the ones you're interested in.</p>
            <Link to="/exams" className="inline-flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline">Browse Exams <FiArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <ExamList exams={bookmarks.slice(0, 3)} />
        )}
      </div>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Notifications</h2>
          <Link to="/notifications" className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
            <FiBell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            No notifications yet. We'll notify you about new exams and deadlines.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n._id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
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
