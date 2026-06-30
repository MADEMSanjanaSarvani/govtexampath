import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@/lib/router';
import { FiSearch, FiX, FiCalendar, FiAlertCircle, FiChevronDown, FiClock, FiInfo, FiDownload, FiExternalLink, FiBell } from 'react-icons/fi';
import { format, parseISO, isAfter, startOfMonth, isSameMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { getExams } from '../services/examService';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Breadcrumb from '../components/common/Breadcrumb';
import { generateICSFile, addToGoogleCalendar } from '../utils/calendarExport';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState(() => {
    try {
      if (typeof window === 'undefined') return {};
      return JSON.parse(localStorage.getItem('examReminders') || '{}');
    } catch { return {}; }
  });

  const toggleReminder = (examId, event, date) => {
    const key = `${examId}_${event}`;
    const updated = { ...reminders };
    if (updated[key]) {
      delete updated[key];
      toast.success('Reminder removed');
    } else {
      updated[key] = { examId, event, date: date.toISOString(), title: event };
      toast.success('Reminder set! We\'ll remind you before this date.');
    }
    setReminders(updated);
    localStorage.setItem('examReminders', JSON.stringify(updated));
  };

  const isReminderSet = (examId, event) => {
    return !!reminders[`${examId}_${event}`];
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const data = await getExams({ limit: 500 });
        setExams(data.exams || []);
      } catch (err) {
        toast.error('Failed to load exam data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Check for upcoming reminders and clean up past ones
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('examReminders') || '{}');
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      let hasUpcoming = false;
      Object.values(stored).forEach(reminder => {
        const reminderDate = new Date(reminder.date);
        if (reminderDate > now && reminderDate <= threeDaysFromNow) {
          if (!hasUpcoming) {
            hasUpcoming = true;
            toast(`\u{1F4C5} Upcoming: ${reminder.event} is in less than 3 days!`, { duration: 5000 });
          }
        }
      });
      // Clean up past reminders
      const cleaned = {};
      Object.entries(stored).forEach(([key, val]) => {
        if (new Date(val.date) > now) cleaned[key] = val;
      });
      if (Object.keys(cleaned).length !== Object.keys(stored).length) {
        localStorage.setItem('examReminders', JSON.stringify(cleaned));
      }
    } catch {}
  }, []);

  const now = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(() => startOfMonth(now), [now]);

  // Event JSON-LD: top upcoming exam dates for structured data
  const eventJsonLd = useMemo(() => {
    if (!exams.length) return null;
    const upcoming = [];
    exams.slice(0, 20).forEach((exam) => {
      if (exam.importantDates) {
        exam.importantDates.slice(0, 2).forEach(({ event, date }) => {
          if (date && isAfter(new Date(date), now)) {
            upcoming.push({
              '@type': 'Event',
              name: `${exam.title} - ${event}`,
              startDate: date,
              endDate: date,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
              location: { '@type': 'VirtualLocation', url: 'https://govtexampath.com/exam-calendar' },
              organizer: { '@type': 'Organization', name: 'GovtExamPath', url: 'https://govtexampath.com' },
              description: `${event} for ${exam.title} government exam`,
              url: `https://govtexampath.com/exams/${exam._id}`,
            });
          }
        });
      }
    });
    if (!upcoming.length) return null;
    return upcoming;
  }, [exams, now]);

  // Build grouped data: month -> exams with their dates
  const groupedByMonth = useMemo(() => {
    const monthMap = new Map();

    exams.forEach((exam) => {
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
  }, [exams, selectedCategory, search, now, currentMonthStart]);

  const totalExams = groupedByMonth.reduce((sum, [, exams]) => sum + exams.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={`Exam Calendar ${new Date().getFullYear()} - Upcoming Government Exam Dates`}
        path="/exam-calendar"
        description={`Government exam calendar ${new Date().getFullYear()} with upcoming exam dates, application deadlines, and schedules for UPSC, SSC, Banking, Railways, Defence, State PSC and more.`}
        jsonLd={eventJsonLd}
        breadcrumbs={[{ name: 'Exam Calendar' }]}
      />
      <Breadcrumb items={[{ label: 'Exam Calendar' }]} />

      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>
      )}

      {!loading && (
      <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <FiCalendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('examCalendarTitle')} <span className="gradient-text">{new Date().getFullYear()}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('examCalendarDesc')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-8 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
        <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('tentativeDatesNote')}
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
              {selectedCategory === 'All' ? t('allCategories') : selectedCategory}
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
                      {cat === 'All' ? t('allCategories') : cat}
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
            placeholder={t('searchExamsByName')}
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
          {t('showing')} <span className="font-semibold text-gray-700 dark:text-gray-200">{totalExams}</span> {t('examsAcrossMonths')}{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">{groupedByMonth.length}</span> {t('monthsLabel')}
        </p>
      )}

      {/* No exams found */}
      {groupedByMonth.length === 0 && (
        <div className="text-center py-20">
          <FiCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('noExamsFound')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {search || selectedCategory !== 'All'
              ? t('noExamsFoundDesc')
              : t('noUpcomingExams')}
          </p>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-5 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              {t('clearAllFilters')}
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
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Google Calendar */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToGoogleCalendar(
                                      `${exam.title} - ${event}`,
                                      `${exam.title}${exam.conductingBody ? ` (${exam.conductingBody})` : ''} - ${event}`,
                                      date,
                                      null,
                                      exam.applicationLink || `https://govtexampath.com/exams/${exam._id}`
                                    );
                                  }}
                                  title={t('addToGoogleCal')}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                  <FiCalendar className="w-3.5 h-3.5" />
                                </button>
                                {/* Download ICS */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generateICSFile(
                                      `${exam.title} - ${event}`,
                                      `${exam.title}${exam.conductingBody ? ` (${exam.conductingBody})` : ''} - ${event}`,
                                      date,
                                      null,
                                      exam.applicationLink || `https://govtexampath.com/exams/${exam._id}`
                                    );
                                  }}
                                  title={t('downloadICS')}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                  <FiDownload className="w-3.5 h-3.5" />
                                </button>
                                {/* Visit Official Site */}
                                {(exam.applicationLink || exam.officialWebsite) && (
                                  <a
                                    href={exam.applicationLink || exam.officialWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Visit Official Website"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                                  >
                                    <FiExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {/* Set Reminder */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleReminder(exam._id, event, date);
                                  }}
                                  title={isReminderSet(exam._id, event) ? 'Remove reminder' : 'Set reminder'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isReminderSet(exam._id, event)
                                      ? 'text-amber-500 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30'
                                      : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-900/30'
                                  }`}
                                >
                                  <FiBell className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Last Date to Apply (if exists and not in current month dates) */}
                      {exam.lastDate && !exam.datesInMonth.some((d) => d.event === 'Last Date to Apply') && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-red-600 dark:text-red-400">{t('lastDateToApply')}:</span>{' '}
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
            <p className="font-medium mb-1">{t('stayUpdated')}</p>
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

      {/* Informational Content Section for SEO */}
      <section className="mt-16 space-y-10">
        {/* Main Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Government Exam Calendar {new Date().getFullYear()}: Complete Schedule
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              The government exam calendar for 2026 is packed with recruitment opportunities across every major category, from UPSC Civil Services and SSC combined exams to banking recruitment drives, railway board notifications, and state public service commission examinations. Every year, central and state government bodies release exam schedules that span all twelve months, and understanding the rhythm of these schedules is essential for any serious aspirant planning to appear for multiple competitive examinations. The calendar year typically begins with prelims notifications for major exams announced in February and March, while the bulk of tier-one and preliminary examinations are conducted between June and September. The final quarter of the year is dominated by mains examinations, skill tests, and document verification rounds for most recruitment cycles.
            </p>
            <p>
              Planning your preparation around the exam calendar is one of the most effective strategies for maximizing your selection chances. Aspirants who track important dates systematically can ensure they never miss an application deadline, an admit card download window, or an exam date. The months of January through March see the highest volume of new notifications from bodies like UPSC, SSC, IBPS, and various State PSCs. April through June is typically the peak application period, when aspirants should be submitting forms and downloading admit cards. July through October sees the highest concentration of actual exam dates across categories, and November through December is when results, counselling, and joining processes for many recruitment cycles take place. By mapping your preparation timeline to this natural cycle, you can allocate study hours more effectively, prioritize subjects based on upcoming exam patterns, and avoid the stress of last-minute rushes.
            </p>
          </div>
        </div>

        {/* Month-by-Month Exam Planning Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Month-by-Month Exam Planning Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">January - March (Q1): Notification Season</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The first quarter is when most major recruiting bodies release their annual calendars and begin publishing notifications. UPSC typically releases the Civil Services Preliminary Exam notification in February, along with NDA, CDS, and CAPF notifications. SSC announces CGL, CHSL, and MTS exam calendars. IBPS publishes its annual recruitment schedule for PO, Clerk, and SO positions. State PSCs across Uttar Pradesh, Rajasthan, Madhya Pradesh, and Bihar also release their annual exam calendars during this period. This is the ideal time to finalize your list of target exams, complete application forms promptly, and solidify your preparation plan for the year ahead.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40">
              <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">April - June (Q2): Application and Revision Phase</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The second quarter is dominated by application submissions and intensive revision. UPSC CSE Prelims is typically scheduled in June, making April and May critical revision months for civil services aspirants. SSC CGL Tier-I exams often begin during this period. Banking exam prelims for SBI PO and SBI Clerk are usually conducted in April or May. Railway recruitment board exams for Group D and NTPC may also commence. Aspirants should focus on completing their syllabus, taking full-length mock tests, analysing weak areas, and ensuring all application forms have been submitted before their respective deadlines close.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">July - September (Q3): Peak Exam Season</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The third quarter is the busiest period in the government exam calendar. IBPS PO and Clerk prelims are usually scheduled between July and September. SSC CGL Tier-II, SSC CHSL Tier-I, and various state PSC prelims are conducted during these months. UPSC CSE Mains is typically held in September. Defence exams including NDA and CDS written tests are also scheduled in this period. Teaching exams like CTET are often held in July or August. This quarter demands peak performance and careful scheduling, as exam dates across categories may overlap, requiring aspirants to prioritize based on their preference and preparation level.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40">
              <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">October - December (Q4): Results and Next-Cycle Preparation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The final quarter sees the conclusion of many recruitment cycles with results, interviews, document verification, and joining. IBPS PO and Clerk mains exams are typically held in October or November. UPSC CSE interviews (personality tests) begin in this period and continue into the new year. SSC results for various tiers are declared. State PSC mains exams for several states are conducted during October and November. This is also the time when smart aspirants begin preparing for the next year's cycle by identifying new target exams, strengthening weak subjects, and building a fresh study plan that accounts for lessons learned from the current year's attempts.
              </p>
            </div>
          </div>
        </div>

        {/* Tips for Managing Multiple Exam Dates */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Tips for Managing Multiple Exam Dates
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
            Most successful government exam aspirants appear for multiple exams in a single year. Managing overlapping schedules, different syllabi, and varying exam patterns requires discipline and a structured approach. Here are five practical tips to help you stay organized and perform your best across all your target examinations.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">1</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Maintain a Centralized Exam Calendar</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Use a digital calendar or a dedicated exam tracking tool to record all important dates in one place, including notification release dates, application deadlines, admit card download windows, exam dates, and result announcement dates. Set reminders at least one week before each deadline so you never miss a critical date. Colour-code entries by exam category to quickly identify which type of exam is approaching. This single habit eliminates the most common reason aspirants miss opportunities: simply forgetting to apply or download their admit card on time.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">2</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Build a Common-Syllabus Foundation First</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Many government exams share core subjects such as Quantitative Aptitude, Reasoning Ability, General Awareness, and English Language. Dedicate the first phase of your preparation to mastering these common topics thoroughly. Once your foundation is strong, you can quickly adapt to the specific syllabus requirements of individual exams with minimal additional study time. This approach is far more efficient than preparing for each exam in isolation, as it creates a multiplier effect where one block of study time benefits performance across multiple examinations.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">3</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Prioritize Exams Based on Preference and Readiness</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Rank your target exams in order of preference, and honestly assess your preparation level for each. When two exams are close together, allocate more revision time to the one you are most likely to clear or the one that offers a better career outcome. It is better to perform well in three or four exams than to spread yourself thin across eight exams and underperform in all of them. Create a priority matrix that considers factors like vacancy count, salary, job location, and your current readiness for each exam's pattern.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">4</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Practice with Exam-Specific Mock Tests Regularly</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Each exam has its own question pattern, difficulty level, time constraints, and marking scheme. Take at least five to ten full-length mock tests for each target exam in the weeks leading up to its date. Analyse your performance after every mock test to identify recurring mistakes and weak topics. Focus on improving speed and accuracy by practicing with timed sections. Mock tests also help you build mental stamina for sitting through three-to-four-hour examination sessions, which is crucial for performing consistently across back-to-back exams.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">5</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Take Care of Logistics and Health</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Plan travel and accommodation well in advance if your exam centre is in a different city. Ensure your identity documents, passport-sized photographs, and admit cards are organized and readily accessible. During intensive exam periods when you may have multiple exams within a few weeks, maintain a balanced diet, get adequate sleep, and include short physical activity in your daily routine. Mental fatigue is a real concern when appearing for back-to-back exams, and aspirants who take care of their physical well-being consistently outperform those who sacrifice health for extra study hours.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Important Deadlines You Should Never Miss */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Important Deadlines You Should Never Miss
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              In the world of government exam preparation, missing a single deadline can cost you an entire year's opportunity. Every recruitment cycle involves a series of time-bound steps, and failing to complete any one of them on time means automatic disqualification regardless of how well-prepared you are. Understanding and tracking these deadlines is as important as studying for the exam itself.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Application Deadlines:</strong> The application window is the very first milestone in any recruitment cycle. Most conducting bodies keep application forms open for three to four weeks after the notification is published, though some may extend deadlines for remote areas or due to technical issues. Always apply within the first week of the notification release to avoid last-minute website crashes, payment gateway failures, or document upload issues. Some exams like UPSC CSE have a single application deadline with no extensions, while IBPS exams occasionally extend their deadlines by a few days. Pay the application fee well before the last date, as payment confirmation can sometimes take 24 to 48 hours.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Admit Card Downloads:</strong> Admit cards are typically released seven to fifteen days before the exam date. Conducting bodies upload them to their official websites and send notifications via email or SMS to registered candidates. However, relying solely on email notifications is risky as messages may land in spam folders or get delayed. Check the official website directly and download your admit card as soon as it is available. Verify all details on the admit card including your name, photograph, exam centre address, reporting time, and roll number. If there is any discrepancy, contact the conducting body immediately through their grievance redressal mechanism. Keep multiple printed copies and a digital backup on your phone.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Result and Document Verification Dates:</strong> After appearing for the exam, the next critical set of deadlines involves result checking and document verification. Results are usually declared within one to three months of the exam date for preliminary stages, and mains results may take longer. Once shortlisted, candidates receive a date for document verification or interview, and failing to appear on the assigned date typically results in cancellation of candidature. Keep all original documents ready at all times including educational certificates, caste or category certificates, domicile certificates, identity proof, and experience certificates if applicable. Some organizations allow a one-time rescheduling of document verification, but many do not. Treat every deadline in the recruitment cycle with the same urgency as the exam date itself.
            </p>
          </div>
        </div>
      </section>
      </>
      )}
    </div>
  );
};

export default ExamCalendar;
