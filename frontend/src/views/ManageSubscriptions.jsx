import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/router';
import { FiBell, FiBellOff, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STORAGE_KEY = 'examSubscriptions';

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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {subscribedCount} {t('subCountOf')} {CATEGORIES.length} {t('subSubscribed')}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {CATEGORIES.length} {t('subCategories')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={subscribedCount === CATEGORIES.length ? unsubscribeAll : subscribeAll}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {subscribedCount === CATEGORIES.length ? (
              <>
                <FiBellOff className="w-4 h-4" />
                {t('subUnsubAll')}
              </>
            ) : (
              <>
                <FiBell className="w-4 h-4" />
                {t('subSubAll')}
              </>
            )}
          </button>
        </div>
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
          return (
            <button
              key={cat.name}
              onClick={() => toggle(cat.name)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700 shadow-sm'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-sm'
              }`}
            >
              {/* Toggle indicator */}
              <div
                className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'bg-teal-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    isActive ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                      {t('subActive')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {cat.description}
                </p>
              </div>

              {/* Bell icon */}
              {isActive ? (
                <FiBell className="w-4.5 h-4.5 text-teal-500 dark:text-teal-400 flex-shrink-0" />
              ) : (
                <FiBellOff className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              )}
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
