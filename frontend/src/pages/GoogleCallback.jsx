import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await api.post('/auth/google/code', {
          code,
          redirect_uri: `${window.location.origin}/auth/google/callback`,
        });
        const payload = response.data.data || response.data;
        localStorage.setItem('token', payload.token);
        window.location.href = '/dashboard';
      } catch {
        setError('Google sign-in failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error}</p>
        <a href="/login" className="text-primary-600 hover:underline">Back to Login</a>
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
