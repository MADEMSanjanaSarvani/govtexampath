import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiUsers, FiBell, FiArrowLeft } from 'react-icons/fi';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/exams', icon: FiFileText, label: 'Manage Exams' },
  { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
  { to: '/admin/notifications', icon: FiBell, label: 'Send Notification' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] hidden lg:block">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Site
        </Link>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Admin Panel</h2>
        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
