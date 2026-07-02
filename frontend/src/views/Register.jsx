import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, Link } from '@/lib/router';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
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
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  const redirectUri = isNative
    ? 'https://govtexampath.com/auth/google/callback'
    : `${window.location.origin}/auth/google/callback`;

  let state;
  if (isNative) {
    state = 'capacitor';
  } else {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    state = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('oauth_state', state);
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account&state=${encodeURIComponent(state)}`;
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

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, labelKey: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, labelKey: 'strengthWeak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, labelKey: 'strengthFair', color: 'bg-orange-500' };
  if (score <= 3) return { score: 3, labelKey: 'strengthGood', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 4, labelKey: 'strengthStrong', color: 'bg-green-500' };
  return { score: 5, labelKey: 'strengthVeryStrong', color: 'bg-emerald-500' };
};

const Register = () => {
  const { isAuthenticated, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
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

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('fullNameRequired');
    if (!form.email) errs.email = t('emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t('invalidEmailFormat');
    if (!form.password) errs.password = t('passwordRequired');
    else if (form.password.length < 6) errs.password = t('passwordMinChars');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('passwordsDoNotMatch');
    if (!agreeTerms) errs.terms = t('mustAgreeToTerms');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('[GovtExamPath] Registration error:', err);
      let msg;
      if (!err.response) {
        msg = 'Our server is starting up — this can take up to 30 seconds on the first visit. Please try again in a moment.';
      } else if (err.response?.status === 429) {
        msg = 'Too many attempts. Please wait a few minutes and try again.';
      } else {
        msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
      }
      toast.error(msg, { duration: 6000 });
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('duplicate')) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes('server') || msg.toLowerCase().includes('starting') || msg.toLowerCase().includes('connect')) {
        setErrors({ general: msg });
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
      <SEO title="Create Account" path="/register" description="Create your free GovtExamPath account. Get career guidance, eligibility checking, and free study resources for government exams." />
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">GovtExamPath</span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Begin your journey to a government career
          </h2>
          <p className="text-purple-100/80 text-lg leading-relaxed mb-8">
            Create your free account and unlock personalized exam guidance, eligibility checking, and preparation resources.
          </p>
          <div className="space-y-4">
            {[
              t('regBenefit1'),
              t('instantEligibility'),
              t('regBenefit3'),
              t('regBenefit2'),
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-3 text-purple-100/90">
                <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-3.5 h-3.5 text-green-300" />
                </div>
                {text}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-white/20">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-purple-200 text-sm mt-1">Free Forever</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">500+</p>
              <p className="text-purple-200 text-sm mt-1">Exam Guides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25 lg:hidden">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t('createAccount')}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('joinCommunity')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('fullName')}</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('enterFullName')}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

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
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{t(strength.labelKey)}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('confirmPassword')}</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('reEnterPassword')}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => { setAgreeTerms(e.target.checked); if (errors.terms) setErrors({ ...errors, terms: '' }); }}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('agreeToTerms')} <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">{t('termsAndConditions')}</a> {t('andThe')} <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">{t('privacyPolicy')}</a>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>{t('createAccount')} <FiArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white dark:bg-gray-800 text-gray-500">{t('orDivider')}</span></div>
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
                    text="signup_with"
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
                    {t('signUpWithGoogle')}
                  </button>
                )}
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  {t('signInHere')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
