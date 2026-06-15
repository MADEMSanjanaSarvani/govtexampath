import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  const d = response.data?.data || {};
  return {
    totalUsers: d.users || 0,
    totalExams: d.exams || 0,
    totalNotifications: d.notifications || 0,
    activeExams: d.activeExams || 0,
  };
};

export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const toggleUserRole = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle-role`);
  return response.data;
};
