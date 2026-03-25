import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookmark, FiShare2, FiExternalLink, FiCalendar, FiDollarSign, FiUsers, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { bookmarkExam } from '../../services/examService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ExamDetail = ({ exam }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(exam?.isBookmarked || false);

  if (!exam) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark exams');
      return;
    }
    try {
      await bookmarkExam(exam._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Exam bookmarked!');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: exam.title, url });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">
                {exam.category || 'General'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{exam.title}</h1>
              {exam.lastDate && (
                <p className="text-primary-100 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" /> Last Date: {formatDate(exam.lastDate)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2.5 rounded-lg transition-colors ${
                  bookmarked
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {exam.salary && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <FiDollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.salary}</p>
                </div>
              </div>
            )}
            {exam.ageLimit && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FiUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Age Limit</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.ageLimit}</p>
                </div>
              </div>
            )}
            {exam.applicationFee && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <FiDollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Application Fee</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.applicationFee}</p>
                </div>
              </div>
            )}
            {exam.lastDate && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <FiClock className="w-8 h-8 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Date</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(exam.lastDate)}</p>
                </div>
              </div>
            )}
          </div>

          {exam.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.description}</p>
            </div>
          )}

          {exam.eligibility && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Eligibility</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{exam.eligibility}</p>
            </div>
          )}

          {exam.importantDates && exam.importantDates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Important Dates</h2>
              <div className="relative pl-6 border-l-2 border-primary-200 dark:border-primary-800 space-y-4">
                {exam.importantDates.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800" />
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.event || item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exam.applicationLink && (
            <a
              href={exam.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors text-lg"
            >
              Apply Now <FiExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
