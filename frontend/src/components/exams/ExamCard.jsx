import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiExternalLink, FiCalendar, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { bookmarkExam } from '../../services/examService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const categoryColors = {
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  GATE: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  APPSC: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  TSPSC: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
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
};

const ExamCard = ({ exam, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(exam.isBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to bookmark exams'); return; }
    setBookmarkLoading(true);
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Exam bookmarked!');
      if (onBookmarkChange) onBookmarkChange(exam._id, !bookmarked);
    } catch { toast.error('Failed to update bookmark'); }
    finally { setBookmarkLoading(false); }
  };

  const colorClass = categoryColors[exam.category] || categoryColors.Other;
  const gradient = categoryGradients[exam.category] || 'from-gray-500 to-gray-600';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${colorClass}`}>
            {exam.category || 'Other'}
          </span>
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-2 rounded-xl transition-all ${
              bookmarked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <Link to={`/exams/${exam._id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {exam.title}
          </h3>
        </Link>

        {exam.conductingBody && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{exam.conductingBody}</p>
        )}

        {exam.eligibility && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{exam.eligibility}</p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          {exam.lastDate && (
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <FiCalendar className="w-3.5 h-3.5" /> {formatDate(exam.lastDate)}
            </span>
          )}
          {exam.salary && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              {exam.salary}
            </span>
          )}
          {exam.ageLimit && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              Age: {exam.ageLimit}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {isAuthenticated ? (
            <Link
              to={`/exams/${exam._id}`}
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
            >
              View Details
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5"
            >
              <FiLock className="w-3.5 h-3.5" /> Login to View
            </Link>
          )}
          {exam.applicationLink && (
            <a
              href={exam.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            >
              Apply <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
