import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { FiBookmark, FiExternalLink, FiCalendar, FiLock, FiClock, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookmarkExam } from '../../services/examService';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

const categoryColors = {
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Postal: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Healthcare: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Miscellaneous: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const categoryGradients = {
  SSC: 'from-blue-500 to-cyan-500',
  UPSC: 'from-purple-500 to-indigo-500',
  Banking: 'from-green-500 to-emerald-500',
  Railways: 'from-red-500 to-rose-500',
  'State PSC': 'from-orange-500 to-red-500',
  Defence: 'from-amber-500 to-orange-500',
  Teaching: 'from-pink-500 to-rose-500',
  Police: 'from-indigo-500 to-blue-500',
  Insurance: 'from-teal-500 to-cyan-500',
  'Regulatory Bodies': 'from-emerald-500 to-teal-500',
  PSU: 'from-slate-500 to-gray-500',
  Judiciary: 'from-yellow-500 to-amber-500',
  Agriculture: 'from-lime-500 to-green-500',
  Postal: 'from-red-400 to-orange-500',
  Healthcare: 'from-pink-400 to-rose-500',
};

const getUpcomingExamDate = (exam) => {
  const now = new Date();
  const dates = exam.importantDates || [];
  for (const d of dates) {
    const label = (d.event || '').toLowerCase();
    if ((label.includes('exam') || label.includes('cbt') || label.includes('prelims')) && !label.includes('completed')) {
      const examDate = new Date(d.date);
      if (examDate >= now) return { date: examDate, label: d.event };
    }
  }
  return null;
};

const ExamCard = ({ exam, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [bookmarked, setBookmarked] = useState(exam.isBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error(t('loginToBookmark')); return; }
    setBookmarkLoading(true);
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? t('bookmarkRemoved') : t('examBookmarked'));
      if (onBookmarkChange) onBookmarkChange(exam._id, !bookmarked);
    } catch { toast.error(t('bookmarkFailed')); }
    finally { setBookmarkLoading(false); }
  };

  const colorClass = categoryColors[exam.category] || categoryColors.Other;
  const gradient = categoryGradients[exam.category] || 'from-gray-500 to-gray-600';
  const upcoming = getUpcomingExamDate(exam);
  const daysLeft = upcoming ? differenceInDays(upcoming.date, new Date()) : null;
  const lastDatePassed = exam.lastDate && new Date(exam.lastDate) < new Date();

  const salaryDisplay = exam.salary ||
    (exam.salaryRange?.min && exam.salaryRange?.max
      ? `₹${Math.round(exam.salaryRange.min / 1000)}K–₹${Math.round(exam.salaryRange.max / 1000)}K`
      : null);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
  };

  const urgencyBorderClass = daysLeft !== null && daysLeft <= 30
    ? 'border-orange-200 dark:border-orange-700/40'
    : 'border-gray-200 dark:border-gray-700/50';

  return (
    <div className={`bg-white dark:bg-gray-800/80 rounded-2xl border ${urgencyBorderClass} hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col`}>

      {/* Category gradient accent bar */}
      <div className={`h-[3px] bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col flex-1">

        {/* Header: category badge + urgency + bookmark */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colorClass}`}>
              {exam.category || 'Other'}
            </span>
            {exam.difficulty && (
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                exam.difficulty === 'Easy'     ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                exam.difficulty === 'Moderate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                exam.difficulty === 'Hard'     ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {exam.difficulty}
              </span>
            )}
            {daysLeft !== null && daysLeft <= 30 && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                daysLeft <= 0  ? 'bg-red-500 text-white' :
                daysLeft <= 7  ? 'bg-red-500 text-white animate-pulse' :
                daysLeft <= 15 ? 'bg-orange-500 text-white' :
                                 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                <FiClock className="w-3 h-3" />
                {daysLeft <= 0 ? t('examToday') : daysLeft === 1 ? `1 ${t('dayLeftSuffix')}` : `${daysLeft} ${t('daysLeftSuffix')}`}
              </span>
            )}
          </div>
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ml-1 ${
              bookmarked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/exams/${exam._id}`}>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {exam.title}
          </h3>
        </Link>

        {exam.conductingBody && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 mt-0.5">{exam.conductingBody}</p>
        )}

        {/* Info badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {exam.lastDate && (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
              lastDatePassed
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
            }`}>
              <FiCalendar className="w-3 h-3 flex-shrink-0" />
              {lastDatePassed ? t('closed') : formatDate(exam.lastDate)}
              {!lastDatePassed && exam.dateStatus === 'tentative' && <span className="opacity-50"> *</span>}
            </span>
          )}
          {salaryDisplay && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs text-green-700 dark:text-green-400 font-medium">
              {salaryDisplay}
            </span>
          )}
          {exam.vacancies && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-400">
              <FiUsers className="w-3 h-3 flex-shrink-0" />
              {exam.vacancies}
            </span>
          )}
          {exam.ageLimit && (
            <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs text-purple-700 dark:text-purple-400">
              Age: {exam.ageLimit}
            </span>
          )}
        </div>

        {/* Upcoming exam date highlight (only within 120 days) */}
        {upcoming && daysLeft !== null && daysLeft > 0 && daysLeft <= 120 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-3 border border-indigo-100 dark:border-indigo-800/30">
            <FiCalendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium flex-1 truncate">
              {upcoming.label}: {format(upcoming.date, 'dd MMM yyyy')}
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {daysLeft}d
            </span>
          </div>
        )}

        {/* Push buttons to bottom */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {isAuthenticated ? (
            <Link
              to={`/exams/${exam._id}`}
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
            >
              {t('viewDetails')}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5"
            >
              <FiLock className="w-3.5 h-3.5" /> {t('loginToView')}
            </Link>
          )}
          {exam.applicationLink && (
            <a
              href={exam.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            >
              {t('apply')} <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
