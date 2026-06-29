import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import Pagination from '../components/common/Pagination';
import SEO from '../components/common/SEO';
import { getExams } from '../services/examService';
import { useLanguage } from '../context/LanguageContext';

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

const Exams = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [state, setState] = useState(searchParams.get('state') || '');

  const fetchExams = useCallback(async () => {
    setLoading(true);
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
    // Reset state filter when switching to a category other than "All" or "State PSC"
    const keepState = newCat === '' || newCat === 'State PSC';
    if (!keepState) setState('');
    const params = {};
    if (search) params.search = search;
    if (newCat) params.category = newCat;
    if (keepState && state) params.state = state;
    setSearchParams(params);
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
      />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('browseExams')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('browseExamsDesc')}</p>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-2xl mb-6">
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

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {allCategories.map((cat) => {
          const isSelected = (cat === 'All' && !category) || category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isSelected
                  ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          );
        })}
        <span className="w-px h-8 bg-gray-300 dark:bg-gray-600 flex-shrink-0 mx-1" />
        {['All', 'Open Now', 'Upcoming', 'Closed'].map((status) => {
          const isActive = statusFilter === status;
          const statusStyles = {
            'All': isActive ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200' : '',
            'Open Now': isActive ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400' : '',
            'Upcoming': isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-400' : '',
            'Closed': isActive ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400' : '',
          };
          const dotColors = {
            'All': isActive ? 'bg-gray-500' : 'bg-gray-400',
            'Open Now': isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400',
            'Upcoming': isActive ? 'bg-blue-500' : 'bg-gray-400',
            'Closed': isActive ? 'bg-red-500' : 'bg-gray-400',
          };
          return (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? statusStyles[status]
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
              {status === 'All' ? t('allCategories') : status === 'Open Now' ? t('openNow') : status === 'Upcoming' ? t('upcoming') : t('closed')}
            </button>
          );
        })}
      </div>

      {/* State filter dropdown - visible when category is "State PSC" or "All" */}
      {(!category || category === 'State PSC') && (
        <div className="flex items-center gap-2 mb-8">
          <FiMapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <select
            value={state || 'All States'}
            onChange={handleStateChange}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm cursor-pointer appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem] pr-10"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")` }}
          >
            {statesList.map((s) => (
              <option key={s} value={s}>{s === 'All States' ? t('allStates') : s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Results */}
      <ExamList exams={(() => {
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
      })()} loading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

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
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">1</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('chooseTip1Title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('chooseTip1Desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">2</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('chooseTip2Title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('chooseTip2Desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">3</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('chooseTip3Title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('chooseTip3Desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">4</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('chooseTip4Title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('chooseTip4Desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">5</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('chooseTip5Title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('chooseTip5Desc')}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('examsPageFaqTitle')}
          </h3>
          <div className="space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('faqQ1')}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('faqA1')}</p>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('faqQ2')}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('faqA2')}</p>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('faqQ3')}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('faqA3')}</p>
            </div>
            <div className="pb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('faqQ4')}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('faqA4')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams;
