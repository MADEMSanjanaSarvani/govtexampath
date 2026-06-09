import api from './api';

export const getNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

export const sendNotification = async (data) => {
  const response = await api.post('/notifications/send', data);
  return response.data;
};

export const getAdminNotifications = async (params = {}) => {
  const response = await api.get('/notifications/admin', { params });
  return response.data;
};

export const updateNotification = async (id, data) => {
  const response = await api.put(`/notifications/admin/${id}`, data);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/admin/${id}`);
  return response.data;
};

export const getNotificationLogs = async (id) => {
  const response = await api.get(`/notifications/admin/${id}/logs`);
  return response.data;
};

export const registerFCMToken = async (token, device = 'android') => {
  const response = await api.post('/notifications/fcm-token', { token, device });
  return response.data;
};

export const removeFCMToken = async (token) => {
  const response = await api.delete('/notifications/fcm-token', { data: { token } });
  return response.data;
};
