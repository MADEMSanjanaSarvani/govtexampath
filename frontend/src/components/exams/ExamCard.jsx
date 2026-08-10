import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { FiBookmark, FiExternalLink, FiCalendar, FiLock, FiClock, FiUsers, FiTrendingUp, FiZap, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookmarkExam } from '../../services/examService';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

const categoryColors = {
  SSC:               'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  UPSC:              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Banking:           'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways:          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'State PSC':       'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Defence:           'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Teaching:          'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police:            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance:         'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PSU:               'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Judiciary:         'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Agriculture:       'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Postal:            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Healthcare:        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Miscellaneous:     'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  Other:             'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const categoryGradients = {
  SSC:               'from-blue-500 to-cyan-500',
  UPSC:              'from-purple-500 to-indigo-500',
  Banking:           'from-green-500 to-emerald-500',
  Railways:          'from-red-500 to-rose-500',
  'State PSC':       'from-orange-500 to-red-500',
  Defence:           'from-amber-500 to-orange-500',
  Teaching:          'from-pink-500 to-rose-500',
  Police:            'from-indigo-500 to-blue-500',
  Insurance:         'from-teal-500 to-cyan-500',
  'Regulatory Bodies': 'from-emerald-500 to-teal-500',
  PSU:               'from-slate-500 to-gray-500',
  Judiciary:         'from-yellow-500 to-amber-500',
  Agriculture:       'from-lime-500 to-green-500',
  Postal:            'from-red-400 to-orange-500',
  Healthcare:        'from-pink-400 to-rose-500',
};

const categoryIcons = {
  SSC: '📋', UPSC: '🏛️', Banking: '🏦', Railways: '🚂', 'State PSC': '🏢',
  Defence: '🎖️', Teaching: '📚', Police: '👮', Insurance: '🛡️',
  'Regulatory Bodies': '⚖️', PSU: '🏭', Judiciary: '⚖️', Agriculture: '🌾',
  Postal: '📮', Healthcare: '🏥', Miscellaneous: '📌', Other: '📌',
};

const getUpcomingExamDate = (exam) => {
  const now = new Date();
  for (const d of (exam.importantDates || [])) {
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
  const [hovered, setHovered] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault(); e.stopPropagation();
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

  const gradient      = categoryGradients[exam.category] || 'from-gray-500 to-gray-600';
  const colorClass    = categoryColors[exam.category] || categoryColors.Other;
  const catIcon       = categoryIcons[exam.category] || '📌';
  const isTentative   = exam.dateStatus === 'tentative';
  const upcoming      = getUpcomingExamDate(exam);
  const daysLeft      = upcoming ? differenceInDays(upcoming.date, new Date()) : null;
  const lastDatePassed = exam.lastDate && new Date(exam.lastDate) < new Date();
  const applyDaysLeft  = exam.lastDate && !lastDatePassed ? differenceInDays(new Date(exam.lastDate), new Date()) : null;

  const salaryDisplay = exam.salary ||
    (exam.salaryRange?.min && exam.salaryRange?.max
      ? `₹${Math.round(exam.salaryRange.min / 1000)}K–₹${Math.round(exam.salaryRange.max / 1000)}K`
      : null);

  const formatDate = (d) => { try { return format(new Date(d), 'dd MMM yy'); } catch { return d; } };

  const urgencyClass =
    applyDaysLeft !== null && applyDaysLeft <= 0  ? 'border-red-400 dark:border-red-600' :
    applyDaysLeft !== null && applyDaysLeft <= 7  ? 'border-red-300 dark:border-red-700/60' :
    applyDaysLeft !== null && applyDaysLeft <= 15 ? 'border-orange-300 dark:border-orange-700/50' :
    'border-gray-200/80 dark:border-gray-700/50';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative bg-white dark:bg-gray-800/90 rounded-2xl border ${urgencyClass}
        transition-all duration-300 overflow-hidden flex flex-col group
        hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5`}
    >
      {/* Gradient top bar — thicker + glowing on hover */}
      <div className={`h-1 bg-gradient-to-r ${gradient} transition-all duration-300 ${hovered ? 'h-1.5' : ''}`} />

      {/* Hover shimmer overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0
        group-hover:from-blue-500/[0.03] group-hover:to-purple-500/[0.03] transition-all duration-500 pointer-events-none`} />

      <div className="p-5 flex flex-col flex-1 relative">

        {/* Header row */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Category icon bubble */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-base flex-shrink-0 shadow-md`}>
              <span>{catIcon}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${colorClass}`}>
                {exam.category || 'Other'}
              </span>
              {exam.difficulty && (
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  exam.difficulty === 'Easy'     ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  exam.difficulty === 'Moderate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  exam.difficulty === 'Hard'     ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>{exam.difficulty}</span>
              )}
              {/* The official notification for this exam hasn't been released yet — dates are
                  our best estimate, not confirmed. This has to be visible here, not just on the
                  exam's own detail page, since this card is what most users actually see first. */}
              {isTentative && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  {t('tentativeLabel')}
                </span>
              )}
              {/* Urgency countdown — muted/non-alarming for tentative exams, since there's no
                  confirmed deadline yet to be genuinely urgent about. */}
              {applyDaysLeft !== null && applyDaysLeft <= 30 && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                  isTentative ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500' :
                  applyDaysLeft <= 0  ? 'bg-red-500 text-white animate-pulse' :
                  applyDaysLeft <= 7  ? 'bg-red-500 text-white' :
                  applyDaysLeft <= 15 ? 'bg-orange-500 text-white' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {!isTentative && <FiZap className="w-3 h-3" />}
                  {applyDaysLeft <= 0 ? t('closed') : isTentative ? `${t('expectedDatePrefix')} ${applyDaysLeft}${t('daysLeft')}` : `${applyDaysLeft}${t('daysLeft')}`}
                </span>
              )}
            </div>
          </div>

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark exam'}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              bookmarked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 scale-110'
                : 'text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110'
            }`}
          >
            <FiBookmark className={`w-4 h-4 transition-all ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/exams/${exam._id}`}>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-0.5 line-clamp-2
            group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {exam.title}
          </h3>
        </Link>
        {exam.conductingBody && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3 truncate">{exam.conductingBody}</p>
        )}

        {/* Key stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {exam.lastDate && (
            <div className={`flex flex-col items-center p-2 rounded-xl text-center ${
              lastDatePassed ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/40'
            }`}>
              <FiCalendar className={`w-3 h-3 mb-0.5 ${lastDatePassed ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium leading-tight ${lastDatePassed ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {lastDatePassed ? t('closed') : formatDate(exam.lastDate)}
                {!lastDatePassed && isTentative ? '*' : ''}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">
                {t('lastDate')}{!lastDatePassed && isTentative ? ` (${t('expectedLabel')})` : ''}
              </span>
            </div>
          )}
          {salaryDisplay && (
            <div className="flex flex-col items-center p-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
              <FiTrendingUp className="w-3 h-3 mb-0.5 text-green-500" />
              <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 leading-tight">{salaryDisplay}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">{t('salary')}</span>
            </div>
          )}
          {exam.vacancies && (
            <div className="flex flex-col items-center p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
              <FiUsers className="w-3 h-3 mb-0.5 text-blue-500" />
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 leading-tight">{exam.vacancies}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">{t('vacancies')}</span>
            </div>
          )}
          {exam.ageLimit && !exam.vacancies && (
            <div className="flex flex-col items-center p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center">
              <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 leading-tight">{exam.ageLimit}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">{t('ageLimit')}</span>
            </div>
          )}
        </div>

        {/* Upcoming exam date */}
        {upcoming && daysLeft !== null && daysLeft > 0 && daysLeft <= 120 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20
            rounded-xl mb-3 border border-indigo-100 dark:border-indigo-800/30">
            <FiClock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium flex-1 truncate">
              {upcoming.label}
            </span>
            <span className="text-xs font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {daysLeft}d
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Action row */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          {isAuthenticated ? (
            <Link
              to={`/exams/${exam._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl
                hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              {t('viewDetails')} <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl
                hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
            >
              <FiLock className="w-3.5 h-3.5" /> {t('loginToView')}
            </Link>
          )}
          {exam.applicationLink && !lastDatePassed && (
            <a
              href={exam.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium
                border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400
                rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
