import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiMessageSquare, FiUsers, FiArrowRight, FiSend, FiExternalLink, FiSearch, FiFilter, FiClock, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  );
};

const CATEGORY_COLORS = {
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Railways: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Defence: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'State PSC': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Police: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
  Insurance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  General: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

const categories = [
  { name: 'UPSC', icon: '\u{1F3DB}\u{FE0F}', discussions: 234, topics: ['CSE Strategy', 'Optional Subjects', 'Interview Tips'] },
  { name: 'SSC', icon: '\u{1F4DD}', discussions: 312, topics: ['CGL Prep', 'CHSL Tips', 'MTS Guide'] },
  { name: 'Banking', icon: '\u{1F3E6}', discussions: 189, topics: ['IBPS PO', 'SBI Clerk', 'RBI Grade B'] },
  { name: 'Railways', icon: '\u{1F683}', discussions: 156, topics: ['RRB NTPC', 'Group D', 'ALP Exam'] },
  { name: 'Defence', icon: '\u{1F396}\u{FE0F}', discussions: 98, topics: ['NDA', 'CDS', 'AFCAT'] },
  { name: 'State PSC', icon: '\u{1F3F0}', discussions: 201, topics: ['APPSC', 'TSPSC', 'UPPSC'] },
  { name: 'Teaching', icon: '\u{1F4DA}', discussions: 134, topics: ['CTET', 'TET', 'KVS'] },
  { name: 'Police', icon: '\u{1F6E1}\u{FE0F}', discussions: 87, topics: ['SI Exam', 'Constable', 'Physical Test'] },
];

const prePopulatedThreads = [
  {
    id: 1,
    title: 'Best strategy for SSC CGL Tier-1 2026?',
    category: 'SSC',
    replies: 47,
    lastActive: '2 hours ago',
    author: 'R',
    authorName: 'Rahul M.',
    preview: 'I have 4 months left for CGL Tier-1. Looking for a day-wise study plan that covers all sections...',
    pinned: false,
  },
  {
    id: 2,
    title: 'UPSC CSE 2026 - Mains optional subject selection advice',
    category: 'UPSC',
    replies: 89,
    lastActive: '1 hour ago',
    author: 'A',
    authorName: 'Ananya S.',
    preview: 'Confused between Sociology and Public Administration as optional. Which has better scoring potential?',
    pinned: true,
  },
  {
    id: 3,
    title: 'IBPS PO interview preparation tips',
    category: 'Banking',
    replies: 34,
    lastActive: '4 hours ago',
    author: 'V',
    authorName: 'Vikash K.',
    preview: 'Cleared IBPS PO Mains! Interview is in 3 weeks. Need guidance on common questions and presentation...',
    pinned: false,
  },
  {
    id: 4,
    title: 'RRB NTPC 2026 syllabus changes - what\'s new?',
    category: 'Railways',
    replies: 23,
    lastActive: '6 hours ago',
    author: 'P',
    authorName: 'Priya T.',
    preview: 'Has anyone noticed the updated syllabus for RRB NTPC 2026? There seem to be some changes in the GK section...',
    pinned: false,
  },
  {
    id: 5,
    title: 'APPSC Group 1 preparation plan for beginners',
    category: 'State PSC',
    replies: 56,
    lastActive: '3 hours ago',
    author: 'S',
    authorName: 'Srinivas R.',
    preview: 'Starting APPSC Group 1 prep from scratch. Need a 6-month roadmap covering all papers...',
    pinned: true,
  },
  {
    id: 6,
    title: 'How to manage job + exam preparation?',
    category: 'General',
    replies: 112,
    lastActive: '30 minutes ago',
    author: 'M',
    authorName: 'Meera J.',
    preview: 'Working 9-6 and preparing for SSC CGL simultaneously. How do you all manage time effectively?',
    pinned: true,
  },
  {
    id: 7,
    title: 'Best free resources for Quantitative Aptitude',
    category: 'General',
    replies: 78,
    lastActive: '5 hours ago',
    author: 'D',
    authorName: 'Deepak V.',
    preview: 'Compiling a list of the best free YouTube channels, PDFs, and websites for Quant prep...',
    pinned: false,
  },
  {
    id: 8,
    title: 'NDA 2026 physical fitness preparation guide',
    category: 'Defence',
    replies: 31,
    lastActive: '8 hours ago',
    author: 'K',
    authorName: 'Karan S.',
    preview: 'The physical test is as important as the written exam. Here is my 3-month fitness plan...',
    pinned: false,
  },
  {
    id: 9,
    title: 'Current Affairs monthly digest - June 2026',
    category: 'General',
    replies: 45,
    lastActive: '1 hour ago',
    author: 'N',
    authorName: 'Neha P.',
    preview: 'Sharing my compiled notes for June 2026 current affairs covering national, international, and economy...',
    pinned: false,
  },
  {
    id: 10,
    title: 'CTET 2026 paper 1 vs paper 2 - which to attempt?',
    category: 'Teaching',
    replies: 29,
    lastActive: '12 hours ago',
    author: 'T',
    authorName: 'Tanvi G.',
    preview: 'B.Ed graduate here. Should I attempt Paper 1 (Class 1-5) or Paper 2 (Class 6-8) or both?',
    pinned: false,
  },
  {
    id: 11,
    title: 'Insurance exam (LIC AAO) preparation roadmap',
    category: 'Insurance',
    replies: 19,
    lastActive: '1 day ago',
    author: 'L',
    authorName: 'Lalit B.',
    preview: 'LIC AAO 2026 notification expected soon. Here is a complete preparation strategy from previous year toppers...',
    pinned: false,
  },
  {
    id: 12,
    title: 'State PSC vs UPSC - which to prioritize?',
    category: 'General',
    replies: 95,
    lastActive: '2 hours ago',
    author: 'G',
    authorName: 'Gaurav N.',
    preview: 'Is it better to focus on State PSC first and then attempt UPSC, or should I prepare for both simultaneously?',
    pinned: false,
  },
];

const externalCommunities = [
  {
    name: 'Telegram Group',
    icon: '\u{1F4E2}',
    description: 'Daily updates, study materials, and instant doubt clearing with 5,000+ active members.',
    url: 'https://t.me/govtexampath',
    color: 'from-sky-500 to-blue-600',
    members: '5,000+',
  },
  {
    name: 'WhatsApp Group',
    icon: '\u{1F4F1}',
    description: 'Exam alerts, admit card notifications, and quick study tips directly on your phone.',
    url: 'https://whatsapp.com/channel/govtexampath',
    color: 'from-green-500 to-emerald-600',
    members: '2,500+',
  },
  {
    name: 'Discord Server',
    icon: '\u{1F3AE}',
    description: 'Voice study rooms, category-wise channels, and mentorship from previous year toppers.',
    url: 'https://discord.gg/govtexampath',
    color: 'from-indigo-500 to-purple-600',
    members: '1,200+',
  },
];

const categoryOptions = ['General', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance'];

const STORAGE_KEY = 'communityPosts';

const getStoredPosts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const Community = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPosts, setUserPosts] = useState(getStoredPosts);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [showAllThreads, setShowAllThreads] = useState(false);
  const discussionsRef = useRef(null);

  useEffect(() => {
    if (userPosts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
    }
  }, [userPosts]);

  const handlePostQuestion = useCallback(() => {
    const trimmed = newQuestion.trim();
    if (!trimmed) {
      toast.error('Please enter your question before posting.');
      return;
    }
    if (trimmed.length < 10) {
      toast.error('Question is too short. Please provide more detail.');
      return;
    }

    const post = {
      id: Date.now(),
      title: trimmed,
      category: newCategory,
      replies: 0,
      lastActive: 'Just now',
      author: 'Y',
      authorName: 'You',
      preview: trimmed.length > 120 ? trimmed.slice(0, 120) + '...' : trimmed,
      pinned: false,
      isUserPost: true,
    };

    setUserPosts((prev) => [post, ...prev]);
    setNewQuestion('');
    toast.success('Your question has been posted!');
  }, [newQuestion, newCategory]);

  const scrollToDiscussions = useCallback((categoryName) => {
    setActiveCategory(categoryName);
    if (discussionsRef.current) {
      discussionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const allThreads = [...userPosts, ...prePopulatedThreads];

  const filteredThreads = allThreads.filter((thread) => {
    const matchesCategory = activeCategory === 'All' || thread.category === activeCategory;
    const matchesSearch = !searchQuery || thread.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const displayedThreads = showAllThreads ? sortedThreads : sortedThreads.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Community Forum"
        path="/community"
        description="Join the GovtExamPath community forum. Connect with fellow government exam aspirants, share strategies, discuss preparation tips for UPSC, SSC, Banking, Railways, and more."
      />
      <Breadcrumb items={[{ label: 'Community' }]} />

      {/* Hero Section */}
      <AnimatedSection>
        <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-12 mb-10">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white opacity-10" />
          <div className="absolute bottom-[-60px] left-[-30px] w-64 h-64 rounded-full bg-white opacity-10" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-5" />
          <div className="relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-5">
              <FiUsers className="w-4 h-4" />
              {t('joinAspirants')}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              {t('communityTitle').replace('Forum', '')}{' '}
              <span className="bg-white/20 px-3 py-1 rounded-lg">Forum</span>
            </h1>
            <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
              {t('communityDesc')}
            </p>
            <div className="max-w-lg mx-auto relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchDiscussions')}
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm sm:text-base"
              />
            </div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Discussion Categories */}
      <AnimatedSection className="mb-12">
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
          <FiFilter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('discussionCategories')}</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              variants={fadeInUp}
              onClick={() => scrollToDiscussions(cat.name)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                activeCategory === cat.name
                  ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{cat.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.discussions} {t('discussions')}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cat.topics.map((topic) => (
                  <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {topic}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </AnimatedSection>

      {/* Popular Discussions */}
      <AnimatedSection className="mb-12">
        <div ref={discussionsRef} className="scroll-mt-24">
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiTrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeCategory === 'All' ? t('popularDiscussions') : `${activeCategory} ${t('discussions')}`}
              </h2>
            </div>
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {t('showAll')}
              </button>
            )}
          </motion.div>

          {/* Category filter pills */}
          <motion.div variants={fadeInUp} className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {['All', ...categoryOptions].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Thread list */}
          <div className="space-y-3">
            {displayedThreads.length === 0 && (
              <motion.div variants={fadeInUp} className="text-center py-16">
                <FiMessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('noDiscussionsFound')}</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t('tryDifferentFilter')}</p>
              </motion.div>
            )}

            {displayedThreads.map((thread) => (
              <motion.div
                key={thread.id}
                variants={fadeInUp}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                  thread.pinned
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                } ${thread.isUserPost ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Author avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${
                    thread.isUserPost
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700'
                  }`}>
                    {thread.author}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {thread.pinned && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-semibold uppercase tracking-wide">
                          {t('pinned')}
                        </span>
                      )}
                      {thread.isUserPost && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-semibold uppercase tracking-wide">
                          {t('yourPost')}
                        </span>
                      )}
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[thread.category] || CATEGORY_COLORS.General}`}>
                        {thread.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {thread.title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1">
                      {thread.preview}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiMessageSquare className="w-3.5 h-3.5" />
                        {thread.replies} {thread.replies === 1 ? t('reply') : t('replies')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        {thread.lastActive}
                      </span>
                      <span className="hidden sm:inline text-gray-400 dark:text-gray-500">
                        by {thread.authorName}
                      </span>
                    </div>
                  </div>

                  <FiArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex-shrink-0 mt-1 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show more / less toggle */}
          {sortedThreads.length > 8 && (
            <motion.div variants={fadeInUp} className="text-center mt-6">
              <button
                onClick={() => setShowAllThreads((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showAllThreads ? t('showLess') : `${t('showAll')} ${sortedThreads.length} ${t('discussions')}`}
                <FiArrowRight className={`w-4 h-4 transition-transform ${showAllThreads ? 'rotate-[-90deg]' : 'rotate-90'}`} />
              </button>
            </motion.div>
          )}
        </div>
      </AnimatedSection>

      {/* Join External Communities */}
      <AnimatedSection className="mb-12">
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
          <FiExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('joinOurCommunities')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {externalCommunities.map((community) => (
            <motion.a
              key={community.name}
              variants={fadeInUp}
              href={community.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${community.color} text-white text-2xl mb-4`}>
                {community.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {community.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{community.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  <FiUsers className="w-3.5 h-3.5 inline mr-1" />
                  {community.members} {t('members')}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  {t('joinNow')} <FiArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </AnimatedSection>

      {/* Ask a Question */}
      <AnimatedSection className="mb-12">
        <motion.div variants={fadeInUp} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <FiSend className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('askQuestion')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('shareYourDoubt')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="community-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('category')}
              </label>
              <select
                id="community-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="community-question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('yourQuestion')}
              </label>
              <textarea
                id="community-question"
                rows={4}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder={t('questionPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5" />
                {t('postsSavedLocally')}
              </p>
              <button
                onClick={handlePostQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <FiSend className="w-4 h-4" />
                {t('postQuestion')}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-10 text-center">
          <div className="absolute top-[-30px] left-[-30px] w-40 h-40 rounded-full bg-white opacity-10" />
          <div className="absolute bottom-[-40px] right-[-20px] w-52 h-52 rounded-full bg-white opacity-10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-3">{t('startExamPrep')}</h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              {t('startExamPrepDesc')}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/exams"
                className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                {t('exploreExams')}
              </Link>
              <Link
                to="/ai-guide"
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
              >
                {t('careerGuide')}
              </Link>
              <Link
                to="/resources"
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
              >
                {t('freeResources')}
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};

export default Community;
