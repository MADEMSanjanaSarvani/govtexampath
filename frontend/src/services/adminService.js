import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  const d = response.data?.data || {};
  return {
    totalUsers: d.users || 0,
    totalExams: d.exams || 0,
    totalNotifications: d.notifications || 0,
    activeExams: d.activeExams || 0,
    expiredActive: d.expiredActive || 0,
    recentlyVerified: d.recentlyVerified || 0,
    categoryStats: d.categoryStats || [],
  };
};

export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data?.data || {};
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const toggleUserRole = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle-role`);
  return response.data;
};

export const getVerificationStats = async () => {
  const response = await api.get('/admin/verification/stats');
  return response.data?.data || {};
};

export const getVerificationLogs = async (params = {}) => {
  const response = await api.get('/admin/verification/logs', { params });
  return response.data?.data || { logs: [], total: 0, page: 1, pages: 1 };
};

export const getManualReviews = async (params = {}) => {
  const response = await api.get('/admin/verification/reviews', { params });
  return response.data?.data || { reviews: [], total: 0, page: 1, pages: 1 };
};

export const triggerVerification = async () => {
  const response = await api.post('/admin/verification/run');
  return response.data?.data || {};
};

export const enrichReviews = async () => {
  const response = await api.post('/admin/verification/enrich');
  return response.data?.data || {};
};

export const approveReview = async (id) => {
  const response = await api.post(`/admin/verification/reviews/${id}/approve`);
  return response.data?.data || {};
};

export const rejectReview = async (id, notes = '') => {
  const response = await api.post(`/admin/verification/reviews/${id}/reject`, { notes });
  return response.data?.data || {};
};
