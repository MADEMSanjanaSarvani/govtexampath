import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useNavigate, useSearchParams } from '@/lib/router';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const exchanged = useRef(false);

  useEffect(() => {
    // On a statically-exported page, router.query starts empty and is only
    // populated with the URL's query string after client-side hydration
    // parses it — reading it before router.isReady flips true would see an
    // empty `code`/`state` even though Google's redirect included them.
    if (!router.isReady) return;
    if (exchanged.current) return;
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    const stateParam = searchParams.get('state');

    if (errorParam) {
      setError(`Google sign-in was cancelled or denied: ${errorParam}`);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Validate OAuth CSRF state for web flow (Capacitor uses a fixed 'capacitor' state)
    if (stateParam !== 'capacitor') {
      const expectedState = sessionStorage.getItem('oauth_state');
      sessionStorage.removeItem('oauth_state');
      if (!stateParam || !expectedState || stateParam !== expectedState) {
        setError('Invalid sign-in state. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
    }

    exchanged.current = true;

    // If state=capacitor AND we're NOT in the Capacitor WebView, we're inside a
    // Chrome Custom Tab opened from the app. Chrome Custom Tab blocks intent://
    // URI navigation from JavaScript, so instead we exchange the OAuth code here
    // (in the Custom Tab), then redirect to the app's custom scheme
    // com.govtexampath.app://auth-success?exchange=CODE which Chrome CAN navigate to.
    // The Custom Tab and the app's WebView are separate cookie jars, so a
    // Set-Cookie here would never reach the app — instead the backend hands
    // back a short-lived, single-purpose exchange code (native: true), and
    // CapacitorInit.jsx trades that for the real session cookie once control
    // is back in the WebView's own context.
    if (stateParam === 'capacitor' && !window.Capacitor) {
      const exchangeAndHandOff = async () => {
        try {
          // Google's authorization code is single-use — retrying this exact
          // request after a slow response (e.g. the backend waking from a
          // Render free-tier cold start) would resend an already-consumed
          // code and fail every time. A longer timeout gives a cold start
          // room to actually finish instead of racing it.
          const response = await api.post('/auth/google/code', {
            code,
            redirect_uri: 'https://govtexampath.com/auth/google/callback',
            native: true,
          }, { timeout: 40000, _skipRetry: true });
          const payload = response.data.data || response.data;
          const exchangeCode = payload.exchangeCode;
          window.location.href = `com.govtexampath.app://auth-success?exchange=${encodeURIComponent(exchangeCode)}`;
        } catch (err) {
          const msg = err.response?.data?.error || 'Google sign-in failed. Please try again.';
          setError(msg);
          setTimeout(() => { window.location.href = '/login'; }, 3000);
        }
      };
      exchangeAndHandOff();
      return;
    }

    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform();
    const redirectUri = isCapacitor
      ? 'https://govtexampath.com/auth/google/callback'
      : `${window.location.origin}/auth/google/callback`;

    const exchangeCode = async () => {
      try {
        // This request shares the WebView's own cookie jar (it's either a
        // plain web browser, or this page loading directly inside the app's
        // WebView — not the separate Custom Tab context handled above), so
        // the httpOnly session cookie set by this response lands correctly
        // without any extra hand-off step.
        // Same single-use-code reasoning as the native branch above: don't
        // let the automatic retry resend an already-consumed code, and give
        // a cold Render backend enough time to actually finish.
        await api.post('/auth/google/code', {
          code,
          redirect_uri: redirectUri,
        }, { timeout: 40000, _skipRetry: true });
        window.gtag?.('event', 'login', { method: 'google' });
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
  }, [router.isReady, searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <SEO title="Signing In" path="/auth/google/callback" noindex />
        <h1 className="sr-only">Google Sign-In</h1>
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
      <SEO title="Signing In" path="/auth/google/callback" noindex />
      <h1 className="sr-only">Google Sign-In</h1>
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400">Signing in with Google...</p>
    </div>
  );
};

export default GoogleCallback;
