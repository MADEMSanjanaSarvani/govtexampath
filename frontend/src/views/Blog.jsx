import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { FiSearch, FiClock, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { blogPosts } from '../data/blogData';
import { useLanguage } from '../context/LanguageContext';

const categories = ['All', 'Strategy', 'Exam Guide', 'Tips', 'Current Affairs', 'Career'];

const categoryColors = {
  Strategy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Exam Guide': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Tips: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Current Affairs': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Career: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const categoryGradients = {
  Strategy: 'from-blue-500 to-cyan-500',
  'Exam Guide': 'from-purple-500 to-indigo-500',
  Tips: 'from-green-500 to-emerald-500',
  'Current Affairs': 'from-orange-500 to-amber-500',
  Career: 'from-red-500 to-rose-500',
};

const Blog = () => {
  const { t } = useLanguage();
  const catLabels = { 'All': t('blogCatAll'), 'Strategy': t('blogCatStrategy'), 'Exam Guide': t('blogCatExamGuide'), 'Tips': t('blogCatTips'), 'Current Affairs': t('blogCatCurrentAffairs'), 'Career': t('blogCatCareer') };
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter(post => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase()) || (post.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = blogPosts.filter(p => p.featured);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Blog - Exam Preparation Tips & Guides" path="/blog" description="Expert tips, strategies, and guides for government exam preparation. SSC CGL, UPSC, Banking, Railways preparation advice from toppers and experts." />

      <Breadcrumb items={[{ label: t('blogTitleHighlight') }]} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
          <FiBookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('blogTitle')} <span className="gradient-text">{t('blogTitleHighlight')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('blogSubtitle')}</p>
      </div>

      {/* Featured posts */}
      {!search && selectedCategory === 'All' && featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featured.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{t('blogFeatured')}</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{post.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("blogSearchPlaceholder")}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'}`}
          >
            {catLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('blogNoResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all"
            >
              <div className={`h-[3px] bg-gradient-to-r ${categoryGradients[post.category] || 'from-gray-400 to-gray-500'}`} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiClock className="w-3 h-3" /> {post.readTime}
                  </span>
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <FiArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
