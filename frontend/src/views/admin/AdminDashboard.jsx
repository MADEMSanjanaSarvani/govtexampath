import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { FiUsers, FiFileText, FiBell, FiCheckCircle, FiPlus, FiSend, FiAlertTriangle, FiShield, FiBarChart2 } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDashboardStats } from '../../services/adminService';
import SEO from '../../components/common/SEO';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setStats({ totalUsers: 0, totalExams: 0, totalNotifications: 0, activeExams: 0, expiredActive: 0, recentlyVerified: 0, categoryStats: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" path="/admin" description="GovtExamPath admin dashboard - manage exams, users, and notifications." />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Overview of your platform</p>

        {loading ? (
          <LoadingSpinner size="lg" className="min-h-[40vh]" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatsCard icon={FiUsers} label="Total Users" value={stats?.totalUsers || 0} color="blue" />
              <StatsCard icon={FiFileText} label="Total Exams" value={stats?.totalExams || 0} color="green" />
              <StatsCard icon={FiCheckCircle} label="Active Exams" value={stats?.activeExams || 0} color="orange" />
              <StatsCard icon={FiBell} label="Notifications Sent" value={stats?.totalNotifications || 0} color="purple" />
              <StatsCard icon={FiAlertTriangle} label="Expired (Need Action)" value={stats?.expiredActive || 0} color="red" />
              <StatsCard icon={FiShield} label="AI Verified (7 days)" value={stats?.recentlyVerified || 0} color="green" />
            </div>

            {stats?.categoryStats?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiBarChart2 className="w-5 h-5" /> Exams by Category
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {stats.categoryStats.map((cat) => (
                      <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{cat._id}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{cat.count}</span>
                          <span className="text-xs text-green-600 dark:text-green-400">({cat.active} active)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/admin/exams"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                    <FiPlus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Manage Exams</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove exams</p>
                  </div>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Manage Users</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View and manage users</p>
                  </div>
                </Link>
                <Link
                  to="/admin/notifications"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <FiSend className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send and manage notifications</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
