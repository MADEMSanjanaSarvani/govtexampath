import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn(`[GovtExamPath] 404 - Route not found: ${location.pathname}${location.search}`);
  }, [location]);

  const isLikelyCategoryPage = /^\/(statepsc|teaching|police|insurance|banking|ssc|upsc|railways|defence|gate|appsc|tspsc)/i.test(location.pathname);

  if (isLikelyCategoryPage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <SEO title="Page Under Development" description="This page is currently being built. Browse all government exams on GovtExamPath." />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Page Under Development</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This category page is being built. In the meantime, you can browse all exams or use the category filter.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/exams"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Browse All Exams
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 transition-all"
            >
              <FiHome className="w-5 h-5" /> Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist. Browse government exams, use our AI guide, or check eligibility on GovtExamPath." />
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            <FiHome className="w-5 h-5" /> Back to Home
          </Link>
          <Link
            to="/exams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" /> Browse Exams
          </Link>
        </div>
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/ai-guide" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">AI Guide</Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/eligibility-checker" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Eligibility Checker</Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/resources" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Resources</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
