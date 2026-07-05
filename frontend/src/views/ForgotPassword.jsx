import React from 'react';
import { FiLock } from 'react-icons/fi';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const ForgotPassword = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="Forgot Password" path="/forgot-password" description="Reset your GovtExamPath account password. Enter your email to receive a password reset link." />
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
              <FiLock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{t('forgotPwdTitle')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('forgotPwdSubtitle')}</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
