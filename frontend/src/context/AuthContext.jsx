import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as authService from '../services/authService';
import { setCsrfToken } from '../services/csrfStore';
import { useLanguage } from './LanguageContext';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Session lives in an httpOnly cookie the browser sends automatically —
  // there's no client-readable token to check locally, so the only way to
  // know "is this visitor logged in" is asking the server.
  const loadUser = useCallback(async () => {
    try {
      const data = await authService.getProfile();
      if (mountedRef.current) {
        setUser(data.data || data);
        setCsrfToken(data.csrfToken);
      }
    } catch (err) {
      // Only a genuine auth rejection (401/403 — no cookie, or it's invalid/expired/revoked)
      // means "not logged in". Network errors, timeouts, and 5xx (e.g. Render free-tier cold
      // start, which can take up to 30s) must NOT clear a session that might actually be valid —
      // that would silently bounce a user back to the login screen with no explanation.
      const status = err?.response?.status;
      if (mountedRef.current && (status === 401 || status === 403)) {
        setUser(null);
        setCsrfToken(null);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, rememberMe = true) => {
    const data = await authService.login(email, password, rememberMe);
    const payload = data.data || data;
    setCsrfToken(payload.csrfToken);
    setUser(payload.user);
    toast.success(t('loggedInSuccess'));
    window.gtag?.('event', 'login', { method: 'email' });
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const payload = data.data || data;
    setCsrfToken(payload.csrfToken);
    setUser(payload.user);
    toast.success(t('registrationSuccess'));
    window.gtag?.('event', 'sign_up', { method: 'email' });
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await authService.googleLogin(credential);
    const payload = data.data || data;
    setCsrfToken(payload.csrfToken);
    setUser(payload.user);
    toast.success(t('signedInWithGoogle'));
    window.gtag?.('event', 'login', { method: 'google' });
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the request fails, clear local state — worst case the
      // cookie outlives its usefulness server-side but the user is signed
      // out of this device's UI, which is what matters to them.
    }
    setCsrfToken(null);
    setUser(null);
    toast.success(t('loggedOutSuccess'));
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    refreshUser: loadUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
