import api from './api';

const createNetworkError = (message) => {
  const error = new Error(message);
  error.response = { data: { message } };
  return error;
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw createNetworkError('Unable to connect to server. Please check if the backend is running or try again later.');
    }
    throw err;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw createNetworkError('Unable to connect to server. The backend server may not be running. Please contact the administrator.');
    }
    throw err;
  }
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw createNetworkError('Unable to connect to server. Please try again later.');
    }
    throw err;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw createNetworkError('Unable to connect to server. Please try again later.');
    }
    throw err;
  }
};
