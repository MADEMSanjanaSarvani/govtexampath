import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const handleGoogleRedirect = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '96181102705-14cljkvhfqkset7mdvke7oae6pj8h4pg.apps.googleusercontent.com';
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  const redirectUri = isNative
    ? 'https://govtexampath.com/auth/google/callback'
    : `${window.location.origin}/auth/google/callback`;
  const state = isNative ? '&state=capacitor' : '';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account${state}`;
  if (isNative) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, windowName: '_self', presentationStyle: 'popover' });
    } catch {
      window.location.href = url;
    }
  } else {
    window.location.href = url;
  }
};

const Login = () => {
  const { isAuthenticated, login, googleLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showFallbackGoogle, setShowFallbackGoogle] = useState(false);
  const googleRef = useRef(null);

  useEffect(() => {
    const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isCapacitor) {
      setShowFallbackGoogle(true);
      return;
    }
    const timer = setTimeout(() => {
      if (googleRef.current && !googleRef.current.querySelector('iframe') && !googleRef.current.querySelector('[role="button"]')) {
        setShowFallbackGoogle(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      console.error('[GovtExamPath] Login error:', err);
      let msg;
      if (!err.response) {
        msg = 'Our server is starting up — this can take up to 30 seconds on the first visit. Please try again in a moment.';
      } else if (err.response?.status === 429) {
        msg = 'Too many login attempts. Please wait a few minutes and try again.';
      } else {
        msg = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please try again.';
      }
      toast.error(msg, { duration: 5000 });
      if (msg.toLowerCase().includes('password')) {
        setErrors({ password: msg });
      } else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('user')) {
        setErrors({ email: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="min-h-[90vh] flex">
      <SEO title="Login" path="/login" description="Sign in to your GovtExamPath account to access your dashboard, bookmarked exams, and personalized career guidance." />
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">GovtExamPath</span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Welcome back to your career journey
          </h2>
          <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
            Access your personalized dashboard, bookmarked exams, and continue your preparation with expert guidance.
          </p>
          <div className="space-y-4">
            {[
              t('loginBenefit2'),
              t('loginBenefit1'),
              t('loginBenefit3'),
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-blue-100/90">
                <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-300 text-sm">&#10003;</span>
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25 lg:hidden">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t('welcomeBack')}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('signInToContinue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('emailAddress')}</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('enterEmail')}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={t('enterPassword')}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('rememberMe')}</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('signingIn')}</>
                ) : (
                  <>{t('signIn')} <FiArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white dark:bg-gray-800 text-gray-500">{t('orContinueWith')}</span></div>
              </div>

              <div className="flex justify-center">
                <div ref={googleRef} className={showFallbackGoogle ? 'hidden' : ''}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        await googleLogin(credentialResponse.credential);
                        navigate('/dashboard');
                      } catch (err) {
                        toast.error(err.response?.data?.error || err.response?.data?.message || 'Google sign-in failed. Please try again.');
                      }
                    }}
                    onError={() => setShowFallbackGoogle(true)}
                    text="signin_with"
                    shape="pill"
                    size="large"
                    width="100%"
                  />
                </div>
                {showFallbackGoogle && (
                  <button
                    type="button"
                    onClick={handleGoogleRedirect}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <GoogleIcon />
                    Sign in with Google
                  </button>
                )}
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('dontHaveAccount')}{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  {t('createOneFree')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
