import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from '@/lib/router';
import { FiSearch, FiX, FiMapPin, FiFilter } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import Pagination from '../components/common/Pagination';
import SEO from '../components/common/SEO';
import { getExams } from '../services/examService';
import { useLanguage } from '../context/LanguageContext';

const examsFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the easiest government exam to crack in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Exams like SSC MTS, RRB Group D, and state-level constable exams are considered relatively accessible. They require only 10th pass qualification and test basic subjects. Consistent preparation of 3–6 months focusing on fundamentals can significantly improve your chances.' },
    },
    {
      '@type': 'Question',
      name: 'Which government exam offers the highest salary?',
      acceptedAnswer: { '@type': 'Answer', text: 'The highest-paying government positions are recruited through UPSC Civil Services (IAS, IPS, IFS) and RBI Grade B. An IAS officer can reach Cabinet Secretary level with a basic pay exceeding ₹2,50,000 per month. RBI Grade B officers start with approximately ₹1,05,000 gross per month.' },
    },
    {
      '@type': 'Question',
      name: 'Can I appear for multiple government exams simultaneously?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many exams share common subjects such as General Awareness, Quantitative Aptitude, English, and Reasoning. An aspirant preparing for SSC CGL can also appear for Banking PO, Railways NTPC, and state-level exams with minimal additional preparation.' },
    },
    {
      '@type': 'Question',
      name: 'What are the age limits for government exams in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Age limits vary across exams. For UPSC Civil Services, the general category age limit is 21–32 years. SSC CGL allows 18–32 years. Banking exams (IBPS PO) have 20–30 years for general category. NDA has 16.5–19.5 years. Age relaxation is available for SC/ST, OBC, PwD, and ex-servicemen categories.' },
    },
  ],
};

const allCategories = [
  'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC',
  'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU',
  'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous',
];

const categoryColors = {
  All: 'from-gray-500 to-gray-600',
  UPSC: 'from-purple-500 to-indigo-600',
  SSC: 'from-blue-500 to-cyan-600',
  Banking: 'from-green-500 to-emerald-600',
  Railways: 'from-red-500 to-rose-600',
  Defence: 'from-amber-500 to-orange-600',
  'State PSC': 'from-orange-500 to-red-600',
  Teaching: 'from-pink-500 to-rose-600',
  Police: 'from-indigo-500 to-blue-600',
  Insurance: 'from-teal-500 to-cyan-600',
  'Regulatory Bodies': 'from-emerald-500 to-teal-600',
  PSU: 'from-slate-500 to-gray-600',
  Judiciary: 'from-yellow-500 to-amber-600',
  Agriculture: 'from-lime-500 to-green-600',
  Postal: 'from-red-500 to-orange-600',
  Healthcare: 'from-red-400 to-pink-600',
  Miscellaneous: 'from-gray-500 to-slate-600',
};

const categoryDotColors = {
  All: 'bg-gray-400',
  UPSC: 'bg-purple-500',
  SSC: 'bg-blue-500',
  Banking: 'bg-green-500',
  Railways: 'bg-red-500',
  Defence: 'bg-amber-500',
  'State PSC': 'bg-orange-500',
  Teaching: 'bg-pink-500',
  Police: 'bg-indigo-500',
  Insurance: 'bg-teal-500',
  'Regulatory Bodies': 'bg-emerald-500',
  PSU: 'bg-slate-500',
  Judiciary: 'bg-yellow-500',
  Agriculture: 'bg-lime-500',
  Postal: 'bg-red-400',
  Healthcare: 'bg-pink-400',
  Miscellaneous: 'bg-gray-500',
};

const categoryEmojis = {
  All: '🗂️', UPSC: '🏛️', SSC: '📋', Banking: '🏦', Railways: '🚂',
  Defence: '🎖️', 'State PSC': '🏢', Teaching: '📚', Police: '👮', Insurance: '🛡️',
  PSU: '🏭', 'Regulatory Bodies': '⚖️', Judiciary: '⚖️', Healthcare: '🏥',
  Postal: '📮', Agriculture: '🌾', Miscellaneous: '📌',
};

const statesList = [
  'All States',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const stateKeywords = {
  'Andhra Pradesh': ['APPSC', 'Andhra Pradesh', 'AP '],
  'Arunachal Pradesh': ['APPSC', 'Arunachal Pradesh'],
  'Assam': ['APSC', 'Assam'],
  'Bihar': ['BPSC', 'Bihar'],
  'Chhattisgarh': ['CGPSC', 'Chhattisgarh', 'CG '],
  'Delhi': ['DSSSB', 'Delhi'],
  'Goa': ['Goa PSC', 'Goa'],
  'Gujarat': ['GPSC', 'Gujarat'],
  'Haryana': ['HPSC', 'HSSC', 'Haryana'],
  'Himachal Pradesh': ['HPPSC', 'Himachal Pradesh', 'HP '],
  'Jammu & Kashmir': ['JKPSC', 'JKSSB', 'Jammu', 'Kashmir'],
  'Jharkhand': ['JPSC', 'JSSC', 'Jharkhand'],
  'Karnataka': ['KPSC', 'Karnataka'],
  'Kerala': ['Kerala PSC', 'Kerala'],
  'Madhya Pradesh': ['MPPSC', 'Madhya Pradesh', 'MP '],
  'Maharashtra': ['MPSC', 'Maharashtra'],
  'Manipur': ['Manipur PSC', 'Manipur'],
  'Meghalaya': ['Meghalaya PSC', 'Meghalaya'],
  'Mizoram': ['Mizoram PSC', 'Mizoram'],
  'Nagaland': ['Nagaland PSC', 'Nagaland'],
  'Odisha': ['OPSC', 'Odisha', 'Orissa'],
  'Punjab': ['PPSC', 'Punjab'],
  'Rajasthan': ['RPSC', 'Rajasthan'],
  'Sikkim': ['Sikkim PSC', 'Sikkim'],
  'Tamil Nadu': ['TNPSC', 'Tamil Nadu', 'TN '],
  'Telangana': ['TSPSC', 'Telangana', 'TS '],
  'Tripura': ['Tripura PSC', 'Tripura'],
  'Uttar Pradesh': ['UPPSC', 'Uttar Pradesh', 'UP '],
  'Uttarakhand': ['UKPSC', 'Uttarakhand'],
  'West Bengal': ['WBPSC', 'West Bengal', 'WB '],
};

const statusOptions = [
  { key: 'All', label: 'All Status', dot: 'bg-gray-400' },
  { key: 'Open Now', label: 'Open Now', dot: 'bg-green-500 animate-pulse' },
  { key: 'Upcoming', label: 'Upcoming', dot: 'bg-blue-500' },
  { key: 'Closed', label: 'Closed', dot: 'bg-red-500' },
];

const Exams = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params = { page: currentPage, limit: 9 };
      const searchTerms = [search, state].filter(Boolean).join(' ');
      if (searchTerms) params.search = searchTerms;
      if (category) params.category = category;
      const data = await getExams(params);
      const list = data.exams || data.data || data;
      setExams(Array.isArray(list) ? list : []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 9) || 1);
    } catch {
      setExams([]);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, state]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
      const params = {};
      if (searchInput) params.search = searchInput;
      if (category) params.category = category;
      if (state) params.state = state;
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;
      setSearchParams(params);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, category, state, statusFilter, setSearchParams]);

  const handleCategoryChange = (cat) => {
    const newCat = cat === 'All' ? '' : cat;
    setCategory(newCat);
    setCurrentPage(1);
    const keepState = newCat === '' || newCat === 'State PSC';
    if (!keepState) setState('');
    const params = {};
    if (search) params.search = search;
    if (newCat) params.category = newCat;
    if (keepState && state) params.state = state;
    setSearchParams(params);
    setMobileSidebarOpen(false);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value === 'All States' ? '' : e.target.value;
    setState(newState);
    setCurrentPage(1);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (newState) params.state = newState;
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setCategory('');
    setStatusFilter('All');
    setState('');
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = category || statusFilter !== 'All' || state || search;

  const filteredExams = (() => {
    let filtered = exams;
    const today = new Date().toISOString().split('T')[0];
    if (state && stateKeywords[state]) {
      const keywords = stateKeywords[state];
      filtered = filtered.filter(e => {
        const title = (e.title || '').toLowerCase();
        const desc = (e.description || '').toLowerCase();
        return keywords.some(kw => title.includes(kw.toLowerCase()) || desc.includes(kw.toLowerCase()));
      });
    }
    if (statusFilter === 'Open Now') {
      filtered = filtered.filter(e => e.lastDate && e.lastDate >= today);
    } else if (statusFilter === 'Upcoming') {
      filtered = filtered.filter(e => {
        const hasUpcomingDates = e.importantDates && Object.values(e.importantDates).some(d => d >= today);
        const noLastDate = !e.lastDate;
        const lastDateFuture = e.lastDate && e.lastDate >= today;
        return hasUpcomingDates && (noLastDate || lastDateFuture);
      });
    } else if (statusFilter === 'Closed') {
      filtered = filtered.filter(e => e.lastDate && e.lastDate < today);
    }
    return filtered;
  })();

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</p>
        <div className="space-y-0.5">
          {allCategories.map((cat) => {
            const isSelected = (cat === 'All' && !category) || category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="text-base w-5 text-center">{categoryEmojis[cat]}</span>
                <span className="flex-1 text-left truncate">{cat === 'All' ? t('allCategories') : cat}</span>
                {isSelected && (
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${categoryDotColors[cat]}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
        <div className="space-y-0.5">
          {statusOptions.map(({ key, label, dot }) => {
            const isActive = statusFilter === key;
            return (
              <button
                key={key}
                onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? dot : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span className="flex-1 text-left">
                  {key === 'All' ? t('allCategories') : key === 'Open Now' ? t('openNow') : key === 'Upcoming' ? t('upcoming') : t('closed')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* State filter */}
      {(!category || category === 'State PSC') && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FiMapPin className="w-3 h-3 text-orange-500" /> State / UT
          </p>
          <select
            value={state || 'All States'}
            onChange={handleStateChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer"
          >
            {statesList.map((s) => (
              <option key={s} value={s}>{s === 'All States' ? t('allStates') : s}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={category ? `${category} Exams - Government Exam Notifications` : 'Browse Government Exams'}
        path={category ? `/exams?category=${encodeURIComponent(category)}` : '/exams'}
        description={
          category
            ? `Browse ${category} government exam notifications. Find eligibility, syllabus, exam pattern, important dates, salary, and apply online for ${category} exams.`
            : 'Browse 500+ government exam notifications including UPSC, SSC, Banking, Railways, Defence, State PSC. Find eligibility, syllabus, dates, and apply online.'
        }
        jsonLd={examsFaqJsonLd}
        breadcrumbs={category ? [{ name: 'Exams', url: '/exams' }, { name: category }] : [{ name: 'Exams' }]}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {category ? (
            <span className="flex items-center gap-2">
              <span>{categoryEmojis[category]}</span>
              <span className="gradient-text">{category}</span>
              <span className="text-gray-900 dark:text-gray-100">Exams</span>
            </span>
          ) : t('browseExams')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('browseExamsDesc')}</p>
      </div>

      {/* Search bar - full width */}
      <div className="relative w-full mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('examSearchPlaceholder')}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile filter bar */}
      <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border flex-shrink-0 transition-all ${
            hasActiveFilters
              ? 'bg-primary-600 text-white border-primary-600 shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}
        >
          <FiFilter className="w-4 h-4" />
          Filters {hasActiveFilters ? '•' : ''}
        </button>
        {category && (
          <span className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${categoryColors[category]}`}>
            {categoryEmojis[category]} {category}
          </span>
        )}
        {statusFilter !== 'All' && (
          <span className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            statusFilter === 'Open Now' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
            statusFilter === 'Upcoming' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
          }`}>
            {statusFilter}
          </span>
        )}
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <FiX className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Mobile filter drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
          <SidebarContent />
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <SidebarContent />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Active filter summary */}
          {category && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border bg-gradient-to-r ${categoryColors[category]}/10 border-current/20`}
              style={{ background: `linear-gradient(to right, rgba(var(--tw-gradient-from-position), 0.05), rgba(var(--tw-gradient-to-position), 0.05))` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center text-lg shadow-md`}>
                {categoryEmojis[category]}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">{category} Exams</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Showing all {category} government exam notifications</p>
              </div>
              <button
                onClick={() => handleCategoryChange('All')}
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          <ExamList exams={filteredExams} loading={loading} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>

      {/* Informational Content Section for SEO */}
      <section className="mt-16 space-y-10">
        {/* Main Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            {t('understandingExamsTitle')}
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p>{t('understandingPara1')}</p>
            <p>{t('understandingPara2')}</p>
            <p>{t('understandingPara3')}</p>
          </div>
        </div>

        {/* Exam Categories Explained */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('examCategoriesTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40">
              <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">UPSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('upscCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">SSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('sscCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40">
              <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Banking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('bankingCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
              <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">Railways</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('railwaysCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Defence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('defenceCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40">
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">State PSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('statePscCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/40">
              <h4 className="font-bold text-pink-800 dark:text-pink-300 mb-2">Teaching</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('teachingCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40">
              <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Police</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('policeCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40">
              <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-2">Insurance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('insuranceCatDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/40">
              <h4 className="font-bold text-slate-800 dark:text-slate-300 mb-2">PSU</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('psuCatDesc')}</p>
            </div>
          </div>
        </div>

        {/* How to Choose the Right Government Exam */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('howToChooseTitle')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
            {t('howToChooseIntro')}
          </p>
          <ul className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">{n}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{t(`chooseTip${n}Title`)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t(`chooseTip${n}Desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('examsPageFaqTitle')}
          </h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((n, i) => (
              <div key={n} className={i < 3 ? 'border-b border-gray-100 dark:border-gray-700 pb-5' : 'pb-2'}>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t(`faqQ${n}`)}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t(`faqA${n}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams;
