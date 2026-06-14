import api from './api';

export const getCurrentAffairs = async (params = {}) => {
  const response = await api.get('/current-affairs', { params });
  return response.data;
};

export const getCurrentAffairById = async (id) => {
  const response = await api.get(`/current-affairs/${id}`);
  return response.data;
};

export const getCurrentAffairsByCategory = async (category, params = {}) => {
  const response = await api.get(`/current-affairs/category/${category}`, { params });
  return response.data;
};
