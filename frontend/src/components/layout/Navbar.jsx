import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiSun, FiMoon, FiMenu, FiX, FiBookmark, FiLogOut, FiHome, FiChevronDown, FiCpu, FiCheckSquare, FiBook, FiGlobe, FiBookOpen, FiInfo, FiMail } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';

const categories = ['UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance'];

const categoryEmojis = {
  UPSC: '🏛️', SSC: '📋', Banking: '🏦', Railways: '🚂',
  Defence: '🎖️', 'State PSC': '🏢', Teaching: '📚', Police: '👮', Insurance: '🛡️'
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [examDropOpen, setExamDropOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const examDropRef = useRef(null);
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
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'
    } border-b border-gray-200/50 dark:border-gray-700/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                GovtExamPath
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLinkClass('/')}>
                <span className="flex items-center gap-1.5"><FiHome className="w-4 h-4" /> Home</span>
              </Link>

              <div className="relative" ref={examDropRef}>
                <button
                  onClick={() => setExamDropOpen(!examDropOpen)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/exams')
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Exams <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${examDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {examDropOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slideDown">
                    <Link
                      to="/exams"
                      onClick={() => setExamDropOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700"
                    >
                      All Exams
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/exams?category=${cat}`}
                        onClick={() => setExamDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <span>{categoryEmojis[cat]}</span> {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/ai-guide" className={navLinkClass('/ai-guide')}>
                <span className="flex items-center gap-1.5"><FiCpu className="w-4 h-4" /> AI Guide</span>
              </Link>
              <Link to="/eligibility-checker" className={navLinkClass('/eligibility-checker')}>
                <span className="flex items-center gap-1.5"><FiCheckSquare className="w-4 h-4" /> Eligibility</span>
              </Link>
              <Link to="/resources" className={navLinkClass('/resources')}>
                <span className="flex items-center gap-1.5"><FiBook className="w-4 h-4" /> Resources</span>
              </Link>
              <Link to="/current-affairs" className={navLinkClass('/current-affairs')}>
                <span className="flex items-center gap-1.5"><FiGlobe className="w-4 h-4" /> Current Affairs</span>
              </Link>
              <Link to="/blog" className={navLinkClass('/blog')}>
                <span className="flex items-center gap-1.5"><FiBookOpen className="w-4 h-4" /> Blog</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slideDown">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiHome className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiBookmark className="w-4 h-4" /> Bookmarks
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <FiUser className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <Link to="/about" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiInfo className="w-4 h-4" /> About Us
                      </Link>
                      <Link to="/contact" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FiMail className="w-4 h-4" /> Contact
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  About
                </Link>
                <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Contact
                </Link>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40">
                  Register
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
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 space-y-1">
          <Link to="/" className={`block ${navLinkClass('/')}`}>Home</Link>
          <Link to="/exams" className={`block ${navLinkClass('/exams')}`}>Exams</Link>
          <Link to="/ai-guide" className={`block ${navLinkClass('/ai-guide')}`}>AI Career Guide</Link>
          <Link to="/eligibility-checker" className={`block ${navLinkClass('/eligibility-checker')}`}>Eligibility Checker</Link>
          <Link to="/mind-maps" className={`block ${navLinkClass('/mind-maps')}`}>Mind Maps</Link>
          <Link to="/resources" className={`block ${navLinkClass('/resources')}`}>Resources</Link>
          <Link to="/current-affairs" className={`block ${navLinkClass('/current-affairs')}`}>Current Affairs</Link>
          <Link to="/blog" className={`block ${navLinkClass('/blog')}`}>Blog</Link>
          <Link to="/about" className={`block ${navLinkClass('/about')}`}>About Us</Link>
          <Link to="/contact" className={`block ${navLinkClass('/contact')}`}>Contact</Link>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Exam Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link key={cat} to={`/exams?category=${cat}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <span className="text-base">{categoryEmojis[cat]}</span> {cat}
                </Link>
              ))}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 flex gap-2">
              <Link to="/login" className="flex-1 text-center px-4 py-2.5 border border-primary-600 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">Login</Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-md">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
