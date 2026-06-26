import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`Google sign-in was cancelled or denied: ${errorParam}`);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    exchanged.current = true;

    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform();
    const redirectUri = isCapacitor
      ? 'https://govtexampath.com/auth/google/callback'
      : `${window.location.origin}/auth/google/callback`;

    const exchangeCode = async () => {
      try {
        const response = await api.post('/auth/google/code', {
          code,
          redirect_uri: redirectUri,
        });
        const payload = response.data.data || response.data;
        localStorage.setItem('token', payload.token);
        // Close the Capacitor in-app browser if it's open, then navigate
        if (isCapacitor) {
          try {
            const { Browser } = await import('@capacitor/browser');
            await Browser.close();
          } catch {}
        }
        window.location.href = '/dashboard';
      } catch (err) {
        const msg = err.response?.data?.error || 'Google sign-in failed. Please try again.';
        if (isCapacitor) {
          try { const { Browser } = await import('@capacitor/browser'); await Browser.close(); } catch {}
        }
        setError(msg);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">!</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">{error}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Redirecting to login...</p>
          <a href="/login" className="text-primary-600 hover:underline font-medium">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400">Signing in with Google...</p>
    </div>
  );
};

export default GoogleCallback;
