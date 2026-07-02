import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiHome, FiBookmark, FiBell, FiShield, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const data = await updateProfile({ name });
      updateUser(data.data || data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="My Profile" path="/profile" description="Manage your GovtExamPath profile settings and account information." />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t('profileTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left sidebar */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 h-24 relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white border-4 border-white dark:border-gray-800 shadow-lg">
                  {initial}
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold uppercase tracking-wide">
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Quick Links</p>
            <div className="space-y-0.5">
              {[
                { to: '/dashboard', Icon: FiHome, label: t('dashboard'), color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { to: '/bookmarks', Icon: FiBookmark, label: t('bookmarks'), color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
                { to: '/notifications', Icon: FiBell, label: 'Notifications', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                { to: '/privacy-policy', Icon: FiShield, label: t('privacyPolicy'), color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' },
              ].map(({ to, Icon, label, color, bg }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <span className="flex-1">{label}</span>
                  <FiArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account status */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">Account Active</p>
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">Your account is verified and in good standing.</p>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Account Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
                  <FiUser className="w-4 h-4" /> {t('profileFullName')}
                </label>
                <div className="sm:col-span-2">
                  {editing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 font-medium py-2">{user?.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
                  <FiMail className="w-4 h-4" /> {t('contactEmailAddress')}
                </label>
                <div className="sm:col-span-2">
                  <p className="text-gray-900 dark:text-gray-100 font-medium py-2">{user?.email}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Email address cannot be changed</p>
                </div>
              </div>

              {/* Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
                  <FiShield className="w-4 h-4" /> Account Type
                </label>
                <div className="sm:col-span-2">
                  <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold capitalize">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {editing && (
              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <FiSave className="w-4 h-4" />
                  }
                  {t('profileSaveChanges')}
                </button>
                <button
                  onClick={() => { setEditing(false); setName(user?.name || ''); }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-4 h-4" /> {t('profileCancel')}
                </button>
              </div>
            )}
          </div>

          {/* Security section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Security</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Change your account password</p>
              </div>
              <Link
                to="/forgot-password"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                Reset <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
