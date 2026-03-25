import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFileText, FiBell, FiCheckCircle, FiUsers, FiBookOpen, FiAward, FiTrendingUp } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import { getExams } from '../services/examService';

const categoryIcons = [
  { name: 'SSC', icon: FiFileText, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { name: 'UPSC', icon: FiAward, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { name: 'Banking', icon: FiTrendingUp, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { name: 'Railways', icon: FiBookOpen, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  { name: 'State PSC', icon: FiUsers, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { name: 'Defence', icon: FiCheckCircle, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
];

const Home = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams({ limit: 6, sort: '-createdAt' });
        setExams(data.exams || data || []);
      } catch {
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Your Gateway to{' '}
              <span className="text-primary-200">Government Jobs</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest government exam notifications, deadlines, and preparation resources. Your career in public service starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/exams"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
              >
                <FiSearch className="w-5 h-5" /> Browse Exams
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-400 transition-colors border border-primary-400"
              >
                <FiBell className="w-5 h-5" /> Get Notifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Exams', value: '500+', color: 'text-primary-600' },
            { label: 'Registered Users', value: '10,000+', color: 'text-green-600' },
            { label: 'Categories', value: '12+', color: 'text-purple-600' },
            { label: 'Daily Updates', value: '50+', color: 'text-orange-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center border border-gray-100 dark:border-gray-700">
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400">Find exams in your preferred category</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryIcons.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/exams?category=${name}`}
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Exams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Latest Exams</h2>
            <p className="text-gray-500 dark:text-gray-400">Recently posted government exam notifications</p>
          </div>
          <Link
            to="/exams"
            className="hidden sm:inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <ExamList exams={exams} loading={loading} />
        <div className="text-center mt-8 sm:hidden">
          <Link to="/exams" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            View All Exams
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">Simple steps to stay ahead in your exam preparation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse Exams', description: 'Explore thousands of government exam notifications sorted by category, date, and relevance.', icon: FiSearch },
              { step: '2', title: 'Get Notified', description: 'Register to receive instant notifications for new exams matching your interests and preferences.', icon: FiBell },
              { step: '3', title: 'Apply & Succeed', description: 'Access direct application links, important dates, and all the details you need to apply on time.', icon: FiCheckCircle },
            ].map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
