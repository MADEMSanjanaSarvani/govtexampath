import React, { useState, useEffect, useCallback } from 'react';
import { FiSend, FiBell, FiCalendar, FiTrash2, FiEdit3, FiClock, FiMail, FiUsers, FiFileText, FiAward, FiDollarSign, FiBriefcase, FiInfo } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { sendNotification, getAdminNotifications, deleteNotification, updateNotification, getNotificationLogs } from '../../services/notificationService';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';
import SEO from '../../components/common/SEO';

const notificationTypes = [
  { value: 'exam_schedule', label: 'Exam Schedule Released', icon: FiCalendar, color: 'blue' },
  { value: 'hall_ticket', label: 'Hall Ticket Available', icon: FiFileText, color: 'purple' },
  { value: 'result', label: 'Results Published', icon: FiAward, color: 'green' },
  { value: 'assignment', label: 'Assignment Deadline', icon: FiFileText, color: 'orange' },
  { value: 'fee_reminder', label: 'Fee Due Reminder', icon: FiDollarSign, color: 'red' },
  { value: 'placement', label: 'Placement Drive', icon: FiBriefcase, color: 'cyan' },
  { value: 'announcement', label: 'General Notice', icon: FiInfo, color: 'indigo' },
  { value: 'general', label: 'General', icon: FiBell, color: 'gray' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'normal', label: 'Normal', color: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
];

const typeColors = {
  exam_schedule: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  hall_ticket: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  result: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  assignment: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  fee_reminder: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  placement: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  announcement: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  new_exam: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  update: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reminder: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const priorityColors = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  low: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

const SendNotification = () => {
  const [form, setForm] = useState({
    title: '', message: '', type: 'general',
    priority: 'normal', targetAudience: 'all',
    scheduledAt: '', expiresAt: '', sendEmail: false,
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchingRecent, setFetchingRecent] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('sent');
  const [editingId, setEditingId] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      const data = await getAdminNotifications({ limit: 20, status: activeTab });
      setNotifications(data.data?.notifications || data.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setFetchingRecent(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setFetchingRecent(true);
    fetchList();
  }, [fetchList]);

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
      const payload = { ...form };
      if (!payload.scheduledAt) delete payload.scheduledAt;
      if (!payload.expiresAt) delete payload.expiresAt;

      if (editingId) {
        await updateNotification(editingId, payload);
        toast.success('Notification updated!');
        setEditingId(null);
      } else {
        await sendNotification(payload);
        toast.success(payload.scheduledAt ? 'Notification scheduled!' : 'Notification sent to all users!');
      }
      setForm({ title: '', message: '', type: 'general', priority: 'normal', targetAudience: 'all', scheduledAt: '', expiresAt: '', sendEmail: false });
      fetchList();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (n) => {
    setEditingId(n._id);
    setForm({
      title: n.title, message: n.message, type: n.type || 'general',
      priority: n.priority || 'normal', targetAudience: n.targetAudience || 'all',
      scheduledAt: n.scheduledAt ? format(new Date(n.scheduledAt), "yyyy-MM-dd'T'HH:mm") : '',
      expiresAt: n.expiresAt ? format(new Date(n.expiresAt), "yyyy-MM-dd'T'HH:mm") : '',
      sendEmail: n.sendEmail || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await deleteNotification(id);
      toast.success('Notification deleted');
      fetchList();
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleViewLogs = async (id) => {
    if (selectedLogs === id) { setSelectedLogs(null); return; }
    try {
      const data = await getNotificationLogs(id);
      setSelectedLogs(id);
      const n = notifications.find((x) => x._id === id);
      if (n) n._logs = data.data || [];
      setNotifications([...notifications]);
    } catch {
      toast.error('Failed to fetch logs');
    }
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    try { return formatDistanceToNow(new Date(date), { addSuffix: true }); } catch { return ''; }
  };

  return (
    <AdminLayout>
      <SEO title="Manage Notifications" path="/admin/notifications" description="Admin panel - manage notifications for GovtExamPath users." />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {editingId ? 'Edit Notification' : 'Send Notification'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Create, schedule, and manage notifications for all users
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Form - 2 columns */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FiBell className="text-primary-600" />
                {editingId ? 'Edit Notification' : 'New Notification'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. SSC CGL 2026 Exam Date Announced"
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm`} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Notification details..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm`} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select name="type" value={form.type} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                      {notificationTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select name="priority" value={form.priority} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                      {priorityOptions.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                  <select name="targetAudience" value={form.targetAudience} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                    <option value="all">All Students</option>
                    <option value="department">Specific Department</option>
                    <option value="year">Specific Year</option>
                    <option value="individual">Individual Student</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiClock className="inline w-3.5 h-3.5 mr-1" /> Schedule (optional)
                    </label>
                    <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiCalendar className="inline w-3.5 h-3.5 mr-1" /> Expires (optional)
                    </label>
                    <input type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="sendEmail" checked={form.sendEmail} onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <FiMail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Also send email notification</span>
                </label>

                <div className="flex gap-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        {editingId ? 'Update' : form.scheduledAt ? 'Schedule' : 'Send Now'}
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', message: '', type: 'general', priority: 'normal', targetAudience: 'all', scheduledAt: '', expiresAt: '', sendEmail: false }); }}
                      className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List - 3 columns */}
          <div className="xl:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'sent' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                Sent
              </button>
              <button onClick={() => setActiveTab('scheduled')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'scheduled' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                <FiClock className="w-4 h-4" /> Scheduled
              </button>
            </div>

            {fetchingRecent ? (
              <div className="flex justify-center py-12"><LoadingSpinner size="md" /></div>
            ) : notifications.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
                <FiBell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                No {activeTab} notifications
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[n.type] || typeColors.general}`}>
                            {n.type?.replace('_', ' ') || 'general'}
                          </span>
                          {n.priority && n.priority !== 'normal' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityColors[n.priority]}`}>
                              {n.priority}
                            </span>
                          )}
                          {n.sendEmail && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-0.5">
                              <FiMail className="w-3 h-3" /> Email
                            </span>
                          )}
                          {n.isScheduled && !n.isSent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-0.5">
                              <FiClock className="w-3 h-3" /> {format(new Date(n.scheduledAt), 'MMM d, h:mm a')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{n.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-gray-400">
                            <FiUsers className="inline w-3 h-3 mr-0.5" />
                            {n.targetAudience === 'all' ? 'All users' : n.targetAudience}
                          </span>
                          <span className="text-[10px] text-gray-400">{formatTime(n.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleViewLogs(n._id)} title="View delivery logs"
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <FiFileText className="w-4 h-4" />
                        </button>
                        {(!n.isSent || n.isScheduled) && (
                          <button onClick={() => handleEdit(n)} title="Edit"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(n._id)} title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Delivery logs */}
                    {selectedLogs === n._id && n._logs && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Logs</p>
                        {n._logs.length === 0 ? (
                          <p className="text-xs text-gray-400">No delivery logs yet</p>
                        ) : (
                          <div className="space-y-1.5">
                            {n._logs.map((log, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  log.channel === 'socket' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  log.channel === 'push' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>{log.channel}</span>
                                <span className="text-gray-500">{log.successCount}/{log.recipientCount} delivered</span>
                                <span className={`${log.status === 'sent' ? 'text-green-500' : log.status === 'partial' ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {log.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
