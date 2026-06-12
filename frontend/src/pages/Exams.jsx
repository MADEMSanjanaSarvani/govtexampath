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
  'All States', 'Andhra Pradesh', 'Bihar', 'Karnataka', 'Madhya Pradesh',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const stateKeywords = {
  'Andhra Pradesh': ['APPSC', 'Andhra Pradesh'],
  'Bihar': ['BPSC', 'Bihar'],
  'Karnataka': ['KPSC', 'Karnataka'],
  'Madhya Pradesh': ['MPPSC', 'Madhya Pradesh'],
  'Rajasthan': ['RPSC', 'Rajasthan'],
  'Tamil Nadu': ['TNPSC', 'Tamil Nadu'],
  'Telangana': ['TSPSC', 'Telangana'],
  'Uttar Pradesh': ['UPPSC', 'Uttar Pradesh'],
  'West Bengal': ['WBPSC', 'West Bengal'],
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
            : 'Browse 200+ government exam notifications including UPSC, SSC, Banking, Railways, Defence, State PSC. Find eligibility, syllabus, dates, and apply online.'
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
            Understanding Government Exams in India
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              Government exams in India represent one of the most significant career pathways for millions of aspirants across the country. Every year, central and state government bodies conduct over 200 competitive examinations to recruit candidates for a wide range of positions spanning administrative services, law enforcement, banking, education, defence, healthcare, and technical fields. These exams are organized across 16 major categories, each governed by its own conducting body, eligibility criteria, exam pattern, and selection process. For job seekers, government positions offer unmatched job security, attractive salary packages with regular pay revisions under the Central Pay Commission, pension benefits, housing allowances, medical coverage, and a host of other perks that make them highly desirable.
            </p>
            <p>
              The landscape of government recruitment in India is vast and can be overwhelming for first-time aspirants. At the national level, the Union Public Service Commission (UPSC) conducts examinations for the prestigious Indian Administrative Service (IAS), Indian Police Service (IPS), and Indian Foreign Service (IFS) among others. The Staff Selection Commission (SSC) recruits for Group B and Group C posts across various central government ministries and departments. The Institute of Banking Personnel Selection (IBPS) and individual banks conduct exams for clerical, probationary officer, and specialist officer positions. The Railway Recruitment Boards (RRBs) handle recruitment for Indian Railways, one of the largest employers in the world. Defence services conduct entries through the National Defence Academy (NDA), Combined Defence Services (CDS), and Air Force Common Admission Test (AFCAT).
            </p>
            <p>
              At the state level, each State Public Service Commission (PSC) conducts its own civil services examination, along with exams for state-level administrative and police services. Teaching positions are filled through exams like CTET, state TETs, and UGC NET. Additionally, Public Sector Undertakings (PSUs) such as ONGC, BHEL, NTPC, and IOCL recruit engineers and specialists through GATE scores and their own recruitment drives. Regulatory bodies like RBI, SEBI, NABARD, and IRDAI also conduct their own examinations for Grade A and Grade B officers. Understanding this ecosystem is the first step toward choosing the right exam and building an effective preparation strategy.
            </p>
          </div>
        </div>

        {/* Exam Categories Explained */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Exam Categories Explained
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40">
              <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">UPSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The Union Public Service Commission conducts India's most prestigious civil services examinations including IAS, IPS, IFS, and over 20 other Group A services. UPSC also conducts CDS, NDA, CAPF, IES/ISS, and other specialized exams. These positions offer the highest levels of authority, responsibility, and compensation in government service, with officers starting at Pay Level 10 and above.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">SSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The Staff Selection Commission recruits for Group B and Group C posts in central government ministries, departments, and organizations. Major exams include SSC CGL (for graduate-level posts like Tax Inspector, Auditor), SSC CHSL (for 12th-pass posts like LDC, DEO), SSC MTS (for 10th-pass positions), and SSC GD Constable. SSC exams are known for their standardized exam patterns and tier-based selection processes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40">
              <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Banking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Banking exams are conducted by IBPS for public sector banks and by individual banks like SBI and RBI for their own recruitment. Key exams include IBPS PO, IBPS Clerk, IBPS SO, SBI PO, SBI Clerk, and RBI Grade B. Banking careers offer competitive salaries, periodic promotions, and benefits such as housing loans at subsidized rates, making them highly sought after by commerce and finance graduates.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
              <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">Railways</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Indian Railways is one of the largest employers in the world, and Railway Recruitment Boards (RRBs) conduct exams for various positions including RRB NTPC (Non-Technical Popular Categories), RRB Group D (Level 1 posts), RRB ALP (Assistant Loco Pilot), and RRB JE (Junior Engineer). Railway jobs provide travel passes, on-campus housing, medical facilities, and the stability of working under a massive government enterprise.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Defence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Defence examinations provide entry into the Indian Army, Navy, and Air Force. Key exams include NDA (National Defence Academy) for 12th-pass candidates, CDS (Combined Defence Services) for graduates, AFCAT for Air Force entry, and Indian Coast Guard recruitment. Defence careers offer adventure, honour, attractive pay and allowances, canteen facilities, and post-retirement benefits including pension and ex-servicemen quotas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40">
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">State PSC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Each state has its own Public Service Commission that conducts examinations for state civil services, police services, and other administrative positions. Popular ones include UPPSC, MPPSC, BPSC, RPSC, WBPSC, TNPSC, and KPSC. State PSC exams are excellent for candidates who wish to serve in their home state, with exam patterns typically modelled after UPSC but focused on state-specific knowledge and regional languages.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/40">
              <h4 className="font-bold text-pink-800 dark:text-pink-300 mb-2">Teaching</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Teaching exams open doors to careers in government schools, colleges, and universities. The Central Teacher Eligibility Test (CTET) and State TETs are mandatory for teaching in government schools. UGC NET qualifies candidates for Assistant Professor positions and Junior Research Fellowships. KVS and NVS conduct separate recruitments for Kendriya Vidyalaya and Navodaya Vidyalaya schools, which are among the most respected government school systems in India.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40">
              <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Police</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Police recruitment exams are conducted at both central and state levels. Central Armed Police Forces (CAPF) like CRPF, BSF, CISF, ITBP, and SSB recruit through SSC and UPSC. State police forces conduct their own constable, sub-inspector, and inspector-level exams. Police careers offer job security, government housing, medical facilities, and the opportunity to serve the nation by maintaining law and order.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40">
              <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-2">Insurance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Insurance sector exams include recruitment for Life Insurance Corporation (LIC), General Insurance Corporation (GIC), and other public sector insurance companies. Positions include Administrative Officer (AO), Assistant, and Development Officer roles. LIC AAO and LIC ADO are among the most popular exams in this category. Insurance jobs offer competitive salaries, performance-based incentives, and comprehensive benefits packages.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/40">
              <h4 className="font-bold text-slate-800 dark:text-slate-300 mb-2">PSU</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Public Sector Undertakings like ONGC, BHEL, NTPC, IOCL, GAIL, Coal India, and SAIL recruit engineers, management trainees, and specialists primarily through GATE scores and their own recruitment processes. PSU jobs are highly valued by engineering graduates as they offer salaries comparable to the private sector along with government job benefits including pension, medical coverage, subsidized housing, and work-life balance.
              </p>
            </div>
          </div>
        </div>

        {/* How to Choose the Right Government Exam */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How to Choose the Right Government Exam
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
            Selecting the right government exam is a crucial decision that depends on your educational qualifications, interests, career aspirations, and personal circumstances. Here are practical tips to help you make an informed choice:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">1</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Assess Your Educational Qualifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Different exams have different eligibility requirements. SSC MTS requires a 10th pass, SSC CHSL requires 12th pass, while UPSC CSE and Banking PO exams require a graduation degree. Engineering graduates can target PSU recruitment through GATE, while law graduates can look at judicial services. Match your qualifications with the exam requirements before committing to preparation.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">2</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Consider the Competition Level and Your Preparation Time</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  UPSC Civil Services has a success rate of less than 0.2%, while some state-level exams and banking exams have relatively higher selection ratios. If you have limited preparation time, consider exams with shorter syllabi and more frequent recruitment cycles like SSC CHSL or IBPS Clerk. For those willing to dedicate 1-2 years, UPSC or State PSC exams offer more prestigious positions.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">3</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Evaluate Salary, Growth, and Job Satisfaction</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Research the pay scale, career progression, posting locations, and nature of work for each position. An IAS officer starts at around Rs. 56,100 basic pay but has immense authority and growth potential. A bank PO starts around Rs. 36,000 but can reach General Manager level. Consider what matters most to you: salary, power, location stability, work-life balance, or public service impact.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">4</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Check Age Limits and Number of Attempts</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Most government exams have age limits that vary by category (General, OBC, SC/ST). UPSC CSE allows 6 attempts for General category up to age 32. SSC exams typically have an upper age limit of 27-30 years. NDA has an age limit of 19.5 years. Plan your exam strategy around these constraints to maximize your chances across multiple examinations.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">5</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Leverage Overlapping Syllabi for Multiple Exams</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Many government exams share common subjects like General Awareness, Quantitative Aptitude, English Language, and Reasoning. If you prepare for SSC CGL, you are simultaneously prepared for a large portion of Banking, Railways, and other exams. Create a preparation plan that covers the common syllabus first, then specialize for individual exams as their dates approach.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Frequently Asked Questions About Government Exams
          </h3>
          <div className="space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What is the easiest government exam to crack?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                While no government exam is truly "easy" given the competition, exams like SSC MTS (Multi-Tasking Staff), RRB Group D, and state-level constable exams are considered relatively more accessible because they require only 10th pass qualification and test basic subjects like General Knowledge, Arithmetic, and Reasoning. The syllabus is shorter, the difficulty level of questions is lower, and the number of vacancies is usually higher compared to exams like UPSC or SSC CGL. However, the competition remains intense due to the large number of applicants. Consistent preparation of 3-6 months with focus on fundamentals can significantly improve your chances of clearing these exams.
              </p>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Which government exam offers the highest salary?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                The highest-paying government positions are typically those recruited through UPSC Civil Services (IAS, IPS, IFS) and RBI Grade B. An IAS officer starts at Pay Level 10 (Rs. 56,100 basic pay) and can reach the Cabinet Secretary level with a basic pay exceeding Rs. 2,50,000 per month plus allowances. RBI Grade B officers start with an approximate gross salary of Rs. 1,05,000 per month. PSU executives recruited through GATE in companies like ONGC and IOCL also receive attractive CTC packages starting from Rs. 12-15 lakhs per annum. Other high-paying positions include SEBI Grade A (approximately Rs. 17.5 LPA), NABARD Grade A, and IRDA Assistant Manager. When considering salary, remember to factor in perks like government housing, medical coverage, LTC, vehicle allowance, and pension benefits.
              </p>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I appear for multiple government exams simultaneously?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Yes, you can absolutely appear for multiple government exams at the same time, and in fact, this is a recommended strategy for most aspirants. Many exams share common subjects such as General Awareness, Quantitative Aptitude, English, and Logical Reasoning, which means preparation for one exam largely covers others. For example, an aspirant preparing for SSC CGL can also appear for Banking PO, Railways NTPC, and various state-level exams with minimal additional preparation. The key is to create a study plan that covers the core syllabus common to all target exams and then dedicate specific time to exam-specific topics as each exam date approaches. Keep a calendar of all application deadlines, admit card dates, and exam schedules to avoid missing any opportunity.
              </p>
            </div>
            <div className="pb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What are the age limits for government exams in India?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Age limits vary significantly across different government exams and categories. For UPSC Civil Services, the general category age limit is 21-32 years, with relaxation of 5 years for SC/ST and 3 years for OBC candidates. SSC CGL allows candidates between 18-32 years for most posts. Banking exams like IBPS PO have an age limit of 20-30 years for general category. NDA has a much narrower window of 16.5-19.5 years. Defence exams like CDS allow candidates up to 24-28 years depending on the entry. State PSC exams typically follow age limits of 21-35 years, with some states like Rajasthan and Madhya Pradesh offering higher upper age limits. Additionally, ex-servicemen, persons with disabilities, and widows receive extra age relaxation as per government norms. Always check the specific notification for exact age criteria, as these can change with each recruitment cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams;
