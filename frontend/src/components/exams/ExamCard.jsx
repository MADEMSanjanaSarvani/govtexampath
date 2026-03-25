import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiExternalLink, FiCalendar, FiDollarSign } from 'react-icons/fi';
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
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const ExamCard = ({ exam, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(exam.isBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to bookmark exams');
      return;
    }
    setBookmarkLoading(true);
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Exam bookmarked!');
      if (onBookmarkChange) onBookmarkChange(exam._id, !bookmarked);
    } catch (err) {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const colorClass = categoryColors[exam.category] || categoryColors.Other;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {exam.category || 'Other'}
          </span>
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <Link to={`/exams/${exam._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {exam.title}
          </h3>
        </Link>
        {exam.eligibility && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{exam.eligibility}</p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {exam.lastDate && (
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" /> Last Date: {formatDate(exam.lastDate)}
            </span>
          )}
          {exam.salary && (
            <span className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4" /> {exam.salary}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/exams/${exam._id}`}
            className="flex-1 text-center px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
          {exam.applicationLink && (
            <a
              href={exam.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
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
