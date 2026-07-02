import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from '@/lib/router';
import { FiUser, FiSun, FiMoon, FiMenu, FiX, FiBookmark, FiLogOut, FiHome, FiChevronDown, FiCpu, FiCheckSquare, FiBook, FiGlobe, FiBookOpen, FiInfo, FiMail, FiHelpCircle, FiShield, FiFileText, FiAlertCircle, FiCalendar, FiColumns, FiClock, FiBarChart2, FiDollarSign, FiTarget, FiMap } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import NotificationBell from '../notifications/NotificationBell';

const categories = ['UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance', 'PSU', 'Regulatory Bodies', 'Judiciary', 'Healthcare', 'Postal', 'Agriculture', 'Miscellaneous'];

const categoryEmojis = {
  UPSC: '🏛️', SSC: '📋', Banking: '🏦', Railways: '🚂',
  Defence: '🎖️', 'State PSC': '🏢', Teaching: '📚', Police: '👮', Insurance: '🛡️',
  PSU: '🏭', 'Regulatory Bodies': '⚖️', Judiciary: '⚖️', Healthcare: '🏥',
  Postal: '📮', Agriculture: '🌾', Miscellaneous: '📌'
};

const toolsDef = [
  { to: '/ai-guide', Icon: FiCpu, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', key: 'careerGuide', desc: 'AI exam path tailored for you' },
  { to: '/eligibility-checker', Icon: FiCheckSquare, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', key: 'eligibilityChecker', desc: 'Find exams you qualify for' },
  { to: '/mind-maps', Icon: FiMap, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', key: 'mindMaps', desc: 'Visual topic breakdowns' },
  { to: '/prep-roadmap', Icon: FiTarget, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', key: 'prepRoadmap', desc: 'Month-by-month study plan' },
  { to: '/exam-priority', Icon: FiBarChart2, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30', key: 'examPriority', desc: 'Rank exams by opportunity' },
  { to: '/exam-calendar', Icon: FiCalendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', key: 'examCalendar', desc: 'All exam dates at a glance' },
  { to: '/cut-off', Icon: FiBarChart2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', key: 'cutOff', desc: 'Previous year cut-off scores' },
  { to: '/compare', Icon: FiColumns, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', key: 'compareExams', desc: 'Side-by-side comparison' },
  { to: '/prep-time-estimator', Icon: FiClock, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30', key: 'prepTime', desc: 'Estimate your prep timeline' },
  { to: '/salary-calculator', Icon: FiDollarSign, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', key: 'salaryCalc', desc: 'Calculate in-hand salary' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [examDropOpen, setExamDropOpen] = useState(false);
  const [moreDropOpen, setMoreDropOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const examDropRef = useRef(null);
  const moreDropRef = useRef(null);
  const langDropRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (examDropRef.current && !examDropRef.current.contains(e.target)) setExamDropOpen(false);
      if (moreDropRef.current && !moreDropRef.current.contains(e.target)) setMoreDropOpen(false);
      if (langDropRef.current && !langDropRef.current.contains(e.target)) setLangDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md'
    } border-b border-gray-200/50 dark:border-gray-700/50`}>

      {/* Top gradient accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo192.png" alt="GovtExamPath" className="w-9 h-9 rounded-lg group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold gradient-text hidden sm:block">
                GovtExamPath
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/') ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                <FiHome className="w-4 h-4" />
              </Link>

              {/* Exams mega-menu */}
              <div className="relative" ref={examDropRef}>
                <button
                  onClick={() => { setExamDropOpen(!examDropOpen); setMoreDropOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/exams')
                      ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {t('exams')} <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${examDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {examDropOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[520px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/50">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Browse by Category</span>
                      <Link to="/exams" onClick={() => setExamDropOpen(false)} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                        View All Exams →
                      </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-0.5 p-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/exams?category=${cat}`}
                          onClick={() => setExamDropOpen(false)}
                          className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors text-center"
                        >
                          <span className="text-xl leading-none">{categoryEmojis[cat]}</span>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-tight">{cat}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tools mega-menu */}
              <div className="relative" ref={moreDropRef}>
                <button
                  onClick={() => { setMoreDropOpen(!moreDropOpen); setExamDropOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    ['/exam-calendar', '/cut-off', '/compare', '/prep-time-estimator', '/salary-calculator', '/exam-priority', '/ai-guide', '/eligibility-checker', '/mind-maps', '/prep-roadmap'].includes(location.pathname)
                      ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {t('tools')} <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreDropOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preparation Tools</span>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5 p-3">
                      {toolsDef.map((tool) => (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          onClick={() => setMoreDropOpen(false)}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.bg}`}>
                            <tool.Icon className={`w-4 h-4 ${tool.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-tight">{t(tool.key)}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight mt-0.5">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/resources" className={navLinkClass('/resources')}>
                <span className="flex items-center gap-1.5"><FiBook className="w-4 h-4" /> {t('resources')}</span>
              </Link>
              <Link to="/current-affairs" className={navLinkClass('/current-affairs')}>
                <span className="flex items-center gap-1.5"><FiGlobe className="w-4 h-4" /> {t('currentAffairs')}</span>
              </Link>
              <Link to="/blog" className={navLinkClass('/blog')}>
                <span className="flex items-center gap-1.5"><FiBookOpen className="w-4 h-4" /> {t('blog')}</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={langDropRef}>
              <button
                onClick={() => setLangDropOpen(!langDropOpen)}
                className="px-2 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1"
              >
                {language.toUpperCase()} <FiChevronDown className="w-3 h-3" />
              </button>
              {langDropOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'te', label: 'తెలుగు' },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => { setLanguage(code); setLangDropOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === code
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User banner */}
                      <div className="px-4 py-3 mb-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiHome className="w-4 h-4" /> {t('dashboard')}
                      </Link>
                      <Link to="/bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiBookmark className="w-4 h-4" /> {t('bookmarks')}
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiUser className="w-4 h-4" /> {t('profile')}
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <FiUser className="w-4 h-4" /> {t('adminPanel')}
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <Link to="/about" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiInfo className="w-4 h-4" /> {t('aboutUs')}
                      </Link>
                      <Link to="/contact" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiMail className="w-4 h-4" /> {t('contact')}
                      </Link>
                      <Link to="/faq" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiHelpCircle className="w-4 h-4" /> {t('faq')}
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <Link to="/privacy-policy" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiShield className="w-3.5 h-3.5" /> {t('privacyPolicy')}
                      </Link>
                      <Link to="/terms-of-service" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiFileText className="w-3.5 h-3.5" /> {t('termsOfService')}
                      </Link>
                      <Link to="/disclaimer" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiAlertCircle className="w-3.5 h-3.5" /> {t('disclaimer')}
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" /> {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/login" className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  {t('login')}
                </Link>
                <Link to="/register" className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40">
                  {t('register')}
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 space-y-1 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <Link to="/mind-maps" className={`block ${navLinkClass('/mind-maps')}`}>{t('mindMaps')}</Link>
          <Link to="/resources" className={`block ${navLinkClass('/resources')}`}>{t('resources')}</Link>
          <Link to="/current-affairs" className={`block ${navLinkClass('/current-affairs')}`}>{t('currentAffairs')}</Link>
          <Link to="/blog" className={`block ${navLinkClass('/blog')}`}>{t('blog')}</Link>
          <Link to="/about" className={`block ${navLinkClass('/about')}`}>{t('aboutUs')}</Link>
          <Link to="/contact" className={`block ${navLinkClass('/contact')}`}>{t('contact')}</Link>
          <Link to="/faq" className={`block ${navLinkClass('/faq')}`}>{t('faq')}</Link>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('exams')}</p>
            <Link to="/exams" className={`block ${navLinkClass('/exams')}`}>{t('allExams')}</Link>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link key={cat} to={`/exams?category=${cat}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <span className="text-base">{categoryEmojis[cat]}</span> {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('tools')}</p>
            {toolsDef.map((tool) => (
              <Link key={tool.to} to={tool.to} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${tool.bg}`}>
                  <tool.Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                </div>
                {t(tool.key)}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('policies')}</p>
            <Link to="/privacy-policy" className="block px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{t('privacyPolicy')}</Link>
            <Link to="/terms-of-service" className="block px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{t('termsOfService')}</Link>
            <Link to="/disclaimer" className="block px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{t('disclaimer')}</Link>
          </div>

          {!isAuthenticated && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 flex gap-2">
              <Link to="/login" className="flex-1 text-center px-4 py-2.5 border border-primary-600 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">{t('login')}</Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-md">{t('register')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
