import axios from 'axios';

const BACKEND_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

const api = axios.create({
  baseURL: BACKEND_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isRetryable = (error) => {
  if (!error.response) return true;
  return error.response.status === 503 || error.response.status === 502;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (config && config._retryCount < MAX_RETRIES && isRetryable(error)) {
      const delay = RETRY_DELAYS[config._retryCount] || 8000;
      config._retryCount += 1;
      await sleep(delay);
      return api(config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Wake up the backend on app load (Render free tier sleeps after inactivity)
export const warmUpBackend = () => {
  const baseUrl = BACKEND_BASE.replace(/\/api$/, '');
  fetch(`${baseUrl}/api/health`, { method: 'GET' }).catch(() => {});
};

export default api;
