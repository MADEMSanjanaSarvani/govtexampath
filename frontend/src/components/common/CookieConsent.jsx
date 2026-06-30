import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { FiShield, FiX } from 'react-icons/fi';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    advertising: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ essential: true, analytics: true, advertising: true }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ essential: true, analytics: false, advertising: false }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center flex-shrink-0">
              <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  We value your privacy
                </h3>
                <button onClick={handleDecline} className="sm:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies to enhance your experience, analyze traffic, and serve ads via Google AdSense.{' '}
                <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>

              {showDetails && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Essential Cookies</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Required for the website to function. Cannot be disabled.</p>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-0.5 cursor-not-allowed opacity-60">
                      <div className="w-5 h-5 bg-white rounded-full" />
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer" onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics Cookies</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Help us understand how visitors use the site (Google Analytics).</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer" onClick={() => setPreferences((p) => ({ ...p, advertising: !p.advertising }))}>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Advertising Cookies</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Used by Google AdSense to serve personalized ads.</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${preferences.advertising ? 'bg-blue-600 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:justify-end">
            {showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md"
              >
                Save Preferences
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-colors shadow-md"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
