import React, { useState, useEffect, useCallback } from 'react';
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUsers, deleteUser, toggleUserRole } from '../../services/adminService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import SEO from '../../components/common/SEO';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers({ page: currentPage, limit: 10 });
      setUsers(data.users || data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleRole = async (id) => {
    try {
      await toggleUserRole(id);
      toast.success('User role updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  };

  return (
    <AdminLayout>
      <SEO title="Manage Users" path="/admin/users" description="Admin panel - manage registered users on GovtExamPath." />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">View and manage registered users</p>

        {loading ? (
          <LoadingSpinner size="lg" className="min-h-[40vh]" />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {u.role === 'admin' ? <FiShield className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRole(u._id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Toggle role"
                            >
                              <FiShield className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
