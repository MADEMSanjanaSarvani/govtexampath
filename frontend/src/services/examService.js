import api from './api';

export const getExams = async (params = {}) => {
  const response = await api.get('/exams', { params });
  return response.data;
};

export const getExamById = async (id) => {
  const response = await api.get(`/exams/${id}`);
  return response.data;
};

export const createExam = async (data) => {
  const response = await api.post('/exams', data);
  return response.data;
};

export const updateExam = async (id, data) => {
  const response = await api.put(`/exams/${id}`, data);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};

export const bookmarkExam = async (id) => {
  const response = await api.post(`/exams/${id}/bookmark`);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/exams/bookmarks/me');
  return response.data;
};
