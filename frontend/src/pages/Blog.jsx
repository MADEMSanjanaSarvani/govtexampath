import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import { blogPosts } from '../data/blogData';

const categories = ['All', 'Strategy', 'Exam Guide', 'Tips', 'Current Affairs', 'Career'];

const categoryColors = {
  Strategy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Exam Guide': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Tips: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Current Affairs': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Career: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter(post => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase()) || post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = blogPosts.filter(p => p.featured);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Blog - Exam Preparation Tips & Guides" path="/blog" description="Expert tips, strategies, and guides for government exam preparation. SSC CGL, UPSC, Banking, Railways preparation advice from toppers and experts." />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
          <FiBookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Preparation <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Expert strategies, tips, and guides for cracking government exams</p>
      </div>

      {/* Featured posts */}
      {!search && selectedCategory === 'All' && featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featured.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Featured</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.description}</p>
              <div className="flex items-center justify-between">
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
            placeholder="Search articles by topic, exam, or keyword..."
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
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No articles found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 card-hover group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">{post.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {post.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1 hidden sm:block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
