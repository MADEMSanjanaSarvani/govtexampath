import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/router';
import { FiBell, FiBellOff, FiInfo, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STORAGE_KEY = 'examSubscriptions';

const CATEGORY_META = {
  UPSC:              { icon: '🏛️', gradient: 'from-purple-500 to-indigo-600' },
  SSC:               { icon: '📋', gradient: 'from-blue-500 to-cyan-600' },
  Banking:           { icon: '🏦', gradient: 'from-green-500 to-emerald-600' },
  Railways:          { icon: '🚂', gradient: 'from-red-500 to-orange-600' },
  Defence:           { icon: '🎖️', gradient: 'from-amber-500 to-yellow-600' },
  'State PSC':       { icon: '🏰', gradient: 'from-teal-500 to-cyan-600' },
  Teaching:          { icon: '📚', gradient: 'from-pink-500 to-rose-600' },
  Police:            { icon: '🛡️', gradient: 'from-slate-500 to-gray-600' },
  Insurance:         { icon: '🔒', gradient: 'from-sky-500 to-blue-600' },
  PSU:               { icon: '⚙️', gradient: 'from-orange-500 to-amber-600' },
  'Regulatory Bodies': { icon: '⚖️', gradient: 'from-violet-500 to-purple-600' },
  Judiciary:         { icon: '🔨', gradient: 'from-yellow-600 to-amber-700' },
  Healthcare:        { icon: '🏥', gradient: 'from-red-500 to-rose-600' },
  Postal:            { icon: '✉️', gradient: 'from-indigo-500 to-blue-600' },
  Agriculture:       { icon: '🌾', gradient: 'from-lime-500 to-green-600' },
  Miscellaneous:     { icon: '📌', gradient: 'from-gray-500 to-slate-600' },
};

const CATEGORIES = [
  { name: 'UPSC', description: 'Civil Services, NDA, CDS, CAPF' },
  { name: 'SSC', description: 'CGL, CHSL, MTS, GD Constable' },
  { name: 'Banking', description: 'IBPS PO/Clerk, SBI PO/Clerk, RBI' },
  { name: 'Railways', description: 'RRB NTPC, Group D, ALP, JE' },
  { name: 'Defence', description: 'NDA, CDS, AFCAT, Indian Navy, Army' },
  { name: 'State PSC', description: 'APPSC, TSPSC, UPPSC, MPPSC' },
  { name: 'Teaching', description: 'CTET, TET, KVS, NVS, DSSSB' },
  { name: 'Police', description: 'SI, Constable, ASI, CRPF, BSF' },
  { name: 'Insurance', description: 'LIC AAO, NIACL AO, UIIC' },
  { name: 'PSU', description: 'ONGC, BHEL, IOCL, NTPC, SAIL' },
  { name: 'Regulatory Bodies', description: 'SEBI, NABARD, RBI, IRDAI' },
  { name: 'Judiciary', description: 'Judge, Court Staff, Law Officer' },
  { name: 'Healthcare', description: 'AIIMS, NEET PG, Staff Nurse, ANM' },
  { name: 'Postal', description: 'India Post GDS, Postman, MTS' },
  { name: 'Agriculture', description: 'ICAR, FCI, NABARD, State Agriculture' },
  { name: 'Miscellaneous', description: 'GATE, NET, Other central & state exams' },
];

const getSubscriptions = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setSubscriptions = (subs) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
};

const syncToBackend = async (categories) => {
  try {
    await api.put('/auth/preferences', { subscribedCategories: categories });
  } catch {
    // Silently fail — localStorage is the source of truth for offline/guest users
  }
};

const ManageSubscriptions = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [subscribed, setSubscribed] = useState([]);

  useEffect(() => {
    const local = getSubscriptions();
    setSubscribed(local);

    if (isAuthenticated) {
      api.get('/auth/preferences')
        .then(res => {
          const remote = res.data?.data?.subscribedCategories;
          if (Array.isArray(remote) && remote.length > 0) {
            setSubscriptions(remote);
            setSubscribed(remote);
          } else if (local.length > 0) {
            syncToBackend(local);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggle = useCallback((category) => {
    setSubscribed((prev) => {
      const isActive = prev.includes(category);
      const updated = isActive
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setSubscriptions(updated);
      if (isAuthenticated) syncToBackend(updated);

      if (isActive) {
        toast(`Unsubscribed from ${category} alerts`, { icon: '🔕' });
      } else {
        toast.success(`Subscribed to ${category} exam alerts!`);
      }

      return updated;
    });
  }, [isAuthenticated]);

  const subscribeAll = () => {
    const all = CATEGORIES.map((c) => c.name);
    setSubscriptions(all);
    setSubscribed(all);
    if (isAuthenticated) syncToBackend(all);
    toast.success('Subscribed to all exam categories!');
  };

  const unsubscribeAll = () => {
    setSubscriptions([]);
    setSubscribed([]);
    if (isAuthenticated) syncToBackend([]);
    toast('Unsubscribed from all categories', { icon: '🔕' });
  };

  const subscribedCount = subscribed.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Manage Exam Subscriptions"
        path="/subscriptions"
        description="Subscribe to specific government exam categories to receive alerts. Manage your UPSC, SSC, Banking, Railways and other exam notification preferences."
      />
      <Breadcrumb items={[{ label: t('subTitleHighlight') }]} />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 mb-8">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white opacity-10" />
        <div className="absolute bottom-[-60px] left-[-30px] w-64 h-64 rounded-full bg-white opacity-10" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-10" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-5">
            <FiBell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {t('subTitle')}{' '}
            <span className="bg-white/20 px-3 py-1 rounded-lg">{t('subTitleHighlight')}</span>
          </h1>
          <p className="text-teal-100 text-base sm:text-lg max-w-2xl mx-auto">
            {t('subSubtitle')}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Mini progress bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{subscribedCount}</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">/ {CATEGORIES.length}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('subSubscribed')}</span>
            </div>
            <div className="w-48 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${(subscribedCount / CATEGORIES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={subscribedCount === CATEGORIES.length ? unsubscribeAll : subscribeAll}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium shadow-sm hover:from-teal-600 hover:to-cyan-700 transition-all active:scale-95"
        >
          {subscribedCount === CATEGORIES.length ? (
            <><FiBellOff className="w-4 h-4" />{t('subUnsubAll')}</>
          ) : (
            <><FiBell className="w-4 h-4" />{t('subSubAll')}</>
          )}
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('subInfoBanner')}
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = subscribed.includes(cat.name);
          const meta = CATEGORY_META[cat.name] || { icon: '📌', gradient: 'from-gray-500 to-slate-600' };
          return (
            <button
              key={cat.name}
              onClick={() => toggle(cat.name)}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden ${
                isActive
                  ? 'bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-600 shadow-md shadow-teal-500/10'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Gradient overlay on active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/[0.04] to-cyan-500/[0.04] pointer-events-none" />
              )}

              {/* Category icon bubble */}
              <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                <span className="text-lg leading-none">{meta.icon}</span>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center shadow">
                    <FiCheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${
                    isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                      {t('subActive')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {cat.description}
                </p>
              </div>

              {/* Toggle switch */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isActive ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA footer */}
      <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 text-center">
        <div className="absolute top-[-30px] left-[-30px] w-40 h-40 rounded-full bg-white opacity-10" />
        <div className="absolute bottom-[-40px] right-[-20px] w-52 h-52 rounded-full bg-white opacity-10" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            {t('subExploreTitle')}
          </h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            {t('subExploreDesc')}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/exams"
              className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {t('subBrowseExams')}
            </Link>
            <Link
              to="/eligibility-checker"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              {t('subCheckElig')}
            </Link>
            <Link
              to="/ai-guide"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              {t('subCareerGuide')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptions;
