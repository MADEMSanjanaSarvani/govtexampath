import api from './api';

const handleAuthError = (err, context) => {
  if (!err.response) {
    const error = new Error(
      err.code === 'ECONNABORTED'
        ? 'Request timed out. The server may be unavailable. Please try again later.'
        : 'Unable to connect to server. Please check your internet connection or try again later.'
    );
    error.response = { data: { message: error.message } };
    throw error;
  }
  throw err;
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (err) {
    handleAuthError(err, 'login');
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (err) {
    handleAuthError(err, 'register');
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (err) {
    handleAuthError(err, 'getProfile');
  }
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
    handleAuthError(err, 'forgotPassword');
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (err) {
    handleAuthError(err, 'resetPassword');
  }
};
