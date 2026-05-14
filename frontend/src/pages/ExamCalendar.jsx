import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX, FiCalendar, FiAlertCircle, FiChevronDown, FiClock, FiInfo } from 'react-icons/fi';
import { format, parseISO, isAfter, startOfMonth, isSameMonth } from 'date-fns';
import { examsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const allCategories = [
  'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC',
  'Teaching', 'Police', 'Insurance', 'PSU', 'Regulatory Bodies',
  'Judiciary', 'Healthcare', 'Postal', 'Agriculture',
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
  PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Healthcare: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Postal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
};

const categoryGradients = {
  UPSC: 'from-purple-500 to-indigo-600',
  SSC: 'from-blue-500 to-cyan-600',
  Banking: 'from-green-500 to-emerald-600',
  Railways: 'from-red-500 to-rose-600',
  Defence: 'from-amber-500 to-orange-600',
  'State PSC': 'from-orange-500 to-red-600',
  Teaching: 'from-pink-500 to-rose-600',
  Police: 'from-indigo-500 to-blue-600',
  Insurance: 'from-teal-500 to-cyan-600',
  PSU: 'from-slate-500 to-gray-600',
  'Regulatory Bodies': 'from-emerald-500 to-teal-600',
  Judiciary: 'from-yellow-500 to-amber-600',
  Healthcare: 'from-rose-400 to-pink-600',
  Postal: 'from-red-500 to-orange-600',
  Agriculture: 'from-lime-500 to-green-600',
};

const ExamCalendar = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const now = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(() => startOfMonth(now), [now]);

  // Build grouped data: month -> exams with their dates
  const groupedByMonth = useMemo(() => {
    const monthMap = new Map();

    examsData.forEach((exam) => {
      // Apply category filter
      if (selectedCategory !== 'All' && exam.category !== selectedCategory) return;
      // Apply search filter
      if (search && !exam.title.toLowerCase().includes(search.toLowerCase())) return;

      // Collect all dates from importantDates and lastDate
      const allDates = [];
      if (exam.importantDates && Array.isArray(exam.importantDates)) {
        exam.importantDates.forEach(({ event, date }) => {
          if (date) {
            try {
              const parsed = parseISO(date);
              if (isAfter(parsed, currentMonthStart) || isSameMonth(parsed, now)) {
                allDates.push({ event, date: parsed });
              }
            } catch {
              // skip invalid dates
            }
          }
        });
      }
      if (exam.lastDate) {
        try {
          const parsed = parseISO(exam.lastDate);
          if (isAfter(parsed, currentMonthStart) || isSameMonth(parsed, now)) {
            allDates.push({ event: 'Last Date to Apply', date: parsed });
          }
        } catch {
          // skip invalid dates
        }
      }

      if (allDates.length === 0) return;

      // Group this exam into each month where it has dates
      const monthsForExam = new Map();
      allDates.forEach(({ event, date }) => {
        const monthKey = format(date, 'yyyy-MM');
        if (!monthsForExam.has(monthKey)) {
          monthsForExam.set(monthKey, []);
        }
        monthsForExam.get(monthKey).push({ event, date });
      });

      // Earliest date across all future dates for sorting
      const earliestDate = allDates.reduce(
        (min, d) => (d.date < min ? d.date : min),
        allDates[0].date
      );

      monthsForExam.forEach((dates, monthKey) => {
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, []);
        }
        // Sort dates within this exam for this month
        dates.sort((a, b) => a.date - b.date);
        monthMap.get(monthKey).push({
          ...exam,
          datesInMonth: dates,
          earliestDate,
        });
      });
    });

    // Sort months chronologically
    const sorted = Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b));

    // Sort exams within each month by earliest date
    sorted.forEach(([, exams]) => {
      exams.sort((a, b) => a.datesInMonth[0].date - b.datesInMonth[0].date);
    });

    return sorted;
  }, [selectedCategory, search, now, currentMonthStart]);

  const totalExams = groupedByMonth.reduce((sum, [, exams]) => sum + exams.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Exam Calendar 2026 - Upcoming Government Exam Dates"
        path="/exam-calendar"
        description="Government exam calendar 2026 with upcoming exam dates, application deadlines, and schedules for UPSC, SSC, Banking, Railways, Defence, State PSC and more. Plan your preparation with our month-by-month exam date tracker."
      />
      <Breadcrumb items={[{ label: 'Exam Calendar' }]} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <FiCalendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Exam <span className="gradient-text">Calendar</span> 2026
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Upcoming government exam dates, application deadlines, and schedules at a glance
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-8 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
        <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          All dates are tentative and subject to change. Always verify from the official notification before making any decisions.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2 w-full sm:w-56 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {selectedCategory !== 'All' && (
                <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${categoryGradients[selectedCategory] || 'from-gray-400 to-gray-500'}`} />
              )}
              {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
            </span>
            <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute z-20 mt-2 w-full sm:w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-h-72 overflow-y-auto">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                      selectedCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat !== 'All' && (
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryGradients[cat] || 'from-gray-400 to-gray-500'}`} />
                      )}
                      {cat === 'All' ? 'All Categories' : cat}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name..."
            className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
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

      {/* Results count */}
      {totalExams > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{totalExams}</span> exam{totalExams !== 1 ? 's' : ''} across{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">{groupedByMonth.length}</span> month{groupedByMonth.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* No exams found */}
      {groupedByMonth.length === 0 && (
        <div className="text-center py-20">
          <FiCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No exams found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {search || selectedCategory !== 'All'
              ? 'No upcoming exam dates match your filters. Try adjusting the category or search term.'
              : 'There are no upcoming exam dates to display at this time.'}
          </p>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-5 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Month-by-month sections */}
      <div className="space-y-10">
        {groupedByMonth.map(([monthKey, exams]) => {
          const monthDate = parseISO(`${monthKey}-01`);
          const monthLabel = format(monthDate, 'MMMM yyyy');

          return (
            <section key={monthKey}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <FiCalendar className="w-4 h-4 text-white" />
                  <h2 className="text-base font-bold text-white">{monthLabel}</h2>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {exams.length} exam{exams.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Exam cards */}
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={`${monthKey}-${exam._id}`}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover"
                  >
                    <div className="p-5">
                      {/* Top row: title + category */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/exams/${exam._id}`}
                            className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {exam.title}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {exam.conductingBody}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {exam.category}
                          </span>
                        </div>
                      </div>

                      {/* Dates grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {exam.datesInMonth.map(({ event, date }, idx) => {
                          const isPast = date < now;
                          const isLastDate = event === 'Last Date to Apply';
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                                isLastDate
                                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40'
                                  : isPast
                                    ? 'bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40'
                              }`}
                            >
                              <FiClock
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  isLastDate
                                    ? 'text-red-500 dark:text-red-400'
                                    : isPast
                                      ? 'text-gray-400 dark:text-gray-500'
                                      : 'text-blue-500 dark:text-blue-400'
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`font-medium truncate ${
                                    isLastDate
                                      ? 'text-red-700 dark:text-red-400'
                                      : isPast
                                        ? 'text-gray-500 dark:text-gray-400'
                                        : 'text-gray-800 dark:text-gray-200'
                                  }`}
                                >
                                  {event}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isLastDate
                                      ? 'text-red-600 dark:text-red-300'
                                      : isPast
                                        ? 'text-gray-400 dark:text-gray-500'
                                        : 'text-blue-600 dark:text-blue-300'
                                  }`}
                                >
                                  {format(date, 'dd MMM yyyy')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Last Date to Apply (if exists and not in current month dates) */}
                      {exam.lastDate && !exam.datesInMonth.some((d) => d.event === 'Last Date to Apply') && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-red-600 dark:text-red-400">Last Date to Apply:</span>{' '}
                            {format(parseISO(exam.lastDate), 'dd MMM yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom info */}
      {groupedByMonth.length > 0 && (
        <div className="mt-12 flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
          <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Stay Updated</p>
            <p>
              Exam dates and schedules may be revised by conducting bodies. Bookmark individual exams from the{' '}
              <Link to="/exams" className="underline hover:text-blue-900 dark:hover:text-blue-200 font-medium">
                Exams page
              </Link>{' '}
              to track changes and receive updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCalendar;
