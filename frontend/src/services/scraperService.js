import api from './api';

export const getScraperStats = async () => {
  const response = await api.get('/scraper/stats');
  return response.data;
};

export const getSources = async () => {
  const response = await api.get('/scraper/sources');
  return response.data;
};

export const addSource = async (data) => {
  const response = await api.post('/scraper/sources', data);
  return response.data;
};

export const updateSource = async (id, data) => {
  const response = await api.put(`/scraper/sources/${id}`, data);
  return response.data;
};

export const deleteSource = async (id) => {
  const response = await api.delete(`/scraper/sources/${id}`);
  return response.data;
};

export const triggerCheck = async (sourceId) => {
  const url = sourceId ? `/scraper/check/${sourceId}` : '/scraper/check';
  const response = await api.post(url);
  return response.data;
};

export const getLogs = async (params = {}) => {
  const response = await api.get('/scraper/logs', { params });
  return response.data;
};
