import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX, FiExternalLink, FiAward, FiChevronDown, FiInfo, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { examsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const allCategories = [
  'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC',
  'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU',
  'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous',
];

const categoryBadgeColors = {
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Postal: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Healthcare: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Miscellaneous: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const getResultStatus = (importantDates) => {
  if (!importantDates || importantDates.length === 0) {
    return { label: 'Awaited', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const now = new Date();
  const resultEntry = importantDates.find(
    (d) => /result/i.test(d.event)
  );

  if (!resultEntry) {
    return { label: 'Awaited', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
  }

  const entryDate = new Date(resultEntry.date);
  const diffMs = entryDate - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs <= 0) {
    return { label: 'Declared', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: FiCheckCircle };
  }
  if (diffDays <= 30) {
    return { label: 'Expected Soon', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: FiClock };
  }
  return { label: 'Awaited', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: FiAlertCircle };
};

const getResultDate = (importantDates) => {
  if (!importantDates || importantDates.length === 0) return null;
  const resultEntry = importantDates.find((d) => /result/i.test(d.event));
  if (resultEntry) return resultEntry.date;
  // Fallback to the last date in importantDates
  const sorted = [...importantDates].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0]?.date || null;
};

const Results = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredExams = useMemo(() => {
    let exams = examsData.filter((exam) => exam.isActive);

    if (category !== 'All') {
      exams = exams.filter((exam) => exam.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      exams = exams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(q) ||
          exam.conductingBody.toLowerCase().includes(q)
      );
    }

    // Sort by most recent result dates first
    exams.sort((a, b) => {
      const dateA = getResultDate(a.importantDates);
      const dateB = getResultDate(b.importantDates);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB) - new Date(dateA);
    });

    return exams;
  }, [search, category]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Latest Government Exam Results 2026 - Check Your Result"
        path="/results"
        description="Check latest government exam results for 2026. Find direct links to results for UPSC, SSC, Banking, Railways, Defence, State PSC, and other competitive exams. Stay updated with declared results and upcoming result dates."
      />
      <Breadcrumb items={[{ label: 'Results' }]} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
          <FiAward className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Latest Government Exam <span className="gradient-text">Results</span> 2026
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest government exam results. Check your result status, find direct links
          to official result portals, and never miss an important result declaration.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exam name or conducting body..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredExams.length}</span> exam{filteredExams.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16">
          <FiAward className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No results found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredExams.map((exam) => {
            const status = getResultStatus(exam.importantDates);
            const StatusIcon = status.icon;
            const resultEntry = exam.importantDates?.find((d) => /result/i.test(d.event));

            return (
              <div
                key={exam._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Top row: Category badge + Status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {exam.category}
                    </span>
                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  {/* Exam Name */}
                  <Link
                    to={`/exams/${exam._id}`}
                    className="font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 line-clamp-2"
                  >
                    {exam.title}
                  </Link>

                  {/* Conducting Body */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {exam.conductingBody}
                  </p>

                  {/* Result Date */}
                  {resultEntry && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{resultEntry.event}:</span>{' '}
                      {formatDate(resultEntry.date)}
                    </p>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      to={`/exams/${exam._id}`}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    >
                      View Details
                    </Link>
                    <a
                      href={exam.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      Visit Official Site
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How to Check Your Result */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiCheckCircle className="w-6 h-6 text-emerald-500" />
          How to Check Your Result
        </h2>
        <ol className="space-y-4">
          {[
            { step: 1, text: 'Visit the official website of the conducting body using the direct links provided above for each exam.' },
            { step: 2, text: 'Navigate to the "Results" or "Score Card" section on the official website.' },
            { step: 3, text: 'Enter your roll number, registration number, date of birth, or other required credentials to log in.' },
            { step: 4, text: 'View your result on screen. Download and save the scorecard or result PDF for your records.' },
            { step: 5, text: 'Check the cut-off marks and category-wise qualifying criteria. If selected, look for further instructions regarding document verification or the next stage of the recruitment process.' },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </span>
              <p className="text-gray-600 dark:text-gray-300 pt-1">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Info Box */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex gap-4">
        <FiInfo className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Results are declared on the official conducting body website. We provide direct links for your convenience.
          Always verify your result from the official source and keep a copy of your scorecard for future reference.
        </p>
      </div>
    </div>
  );
};

export default Results;
