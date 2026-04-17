import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const routeLabels = {
  'exams': 'Exams',
  'ai-guide': 'AI Career Guide',
  'eligibility-checker': 'Eligibility Checker',
  'mind-maps': 'Mind Maps',
  'resources': 'Resources',
  'current-affairs': 'Current Affairs',
  'blog': 'Blog',
  'login': 'Login',
  'register': 'Register',
  'dashboard': 'Dashboard',
  'bookmarks': 'Bookmarks',
  'notifications': 'Notifications',
  'profile': 'Profile',
  'about': 'About Us',
  'contact': 'Contact',
  'privacy-policy': 'Privacy Policy',
  'terms': 'Terms of Service',
  'forgot-password': 'Forgot Password',
  'reset-password': 'Reset Password',
  'admin': 'Admin',
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        <li className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1" itemProp="item">
            <FiHome className="w-3.5 h-3.5" />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const label = routeLabels[segment] || segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

          return (
            <li key={path} className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <FiChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              {isLast ? (
                <span className="text-gray-900 dark:text-gray-100 font-medium" itemProp="name">{label}</span>
              ) : (
                <Link to={path} className="hover:text-primary-600 transition-colors" itemProp="item">
                  <span itemProp="name">{label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
