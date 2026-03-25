import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { sendNotification, getNotifications } from '../../services/notificationService';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const SendNotification = () => {
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [fetchingRecent, setFetchingRecent] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getNotifications({ limit: 10 });
        setRecentNotifications(data.notifications || data || []);
      } catch {
        setRecentNotifications([]);
      } finally {
        setFetchingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await sendNotification(form);
      toast.success('Notification sent to all users!');
      setForm({ title: '', message: '', type: 'info' });
      const data = await getNotifications({ limit: 10 });
      setRecentNotifications(data.notifications || data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    try { return formatDistanceToNow(new Date(date), { addSuffix: true }); } catch { return ''; }
  };

  const typeColors = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Send Notification</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Send notifications to all registered users</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">New Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Notification title"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Notification message..."
                  className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend className="w-5 h-5" /> Send to All Users
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Notifications</h2>
            {fetchingRecent ? (
              <LoadingSpinner size="md" />
            ) : recentNotifications.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                No notifications sent yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentNotifications.map((n) => (
                  <div key={n._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[n.type] || typeColors.info}`}>
                        {n.type || 'info'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatTime(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SendNotification;
