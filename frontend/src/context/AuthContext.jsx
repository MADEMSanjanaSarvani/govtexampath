import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const storeToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

const clearTokens = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Decode JWT to get basic user info immediately (no backend needed)
    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        clearTokens();
        setToken(null);
        setLoading(false);
        return;
      }
      setUser({ id: payload.id, email: payload.email, role: payload.role });
      setToken(storedToken);
      setLoading(false);
    } catch {
      // Token is malformed
    }

    // Fetch full profile in background
    try {
      const data = await authService.getProfile();
      setUser(data.data || data.user || data);
      setToken(storedToken);
    } catch {
      clearTokens();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, rememberMe = true) => {
    const data = await authService.login(email, password);
    // Backend returns { success, data: { token, user } } — handle both nested and flat
    const payload = data.data || data;
    const t = payload.token;
    storeToken(t, rememberMe);
    setToken(t);
    setUser(payload.user);
    toast.success('Logged in successfully!');
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    // Backend returns { success, data: { token, user } } — handle both nested and flat
    const payload = data.data || data;
    const t = payload.token;
    storeToken(t, true);
    setToken(t);
    setUser(payload.user);
    toast.success('Registration successful!');
    // Send welcome email via Brevo (fire-and-forget)
    fetch('/.netlify/functions/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    }).catch(() => {});
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await authService.googleLogin(credential);
    const payload = data.data || data;
    const t = payload.token;
    storeToken(t, true);
    setToken(t);
    setUser(payload.user);
    toast.success('Signed in with Google!');
    // Send welcome email for new Google users (fire-and-forget)
    fetch('/.netlify/functions/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: payload.user?.name, email: payload.user?.email }),
    }).catch(() => {});
    return data;
  };

  const logout = () => {
    clearTokens();
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
