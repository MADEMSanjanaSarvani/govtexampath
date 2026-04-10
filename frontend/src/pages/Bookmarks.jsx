import React, { useState, useEffect } from 'react';
import { FiBookmark } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBookmarks } from '../services/examService';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getBookmarks();
      const list = data.exams || data.data || data;
      setBookmarks(Array.isArray(list) ? list : []);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkChange = (examId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((e) => e._id !== examId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Bookmarks</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Exams you've saved for later</p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No bookmarks yet"
          description="Start bookmarking exams to keep track of the ones you're interested in."
        />
      ) : (
        <ExamList exams={bookmarks.map(e => ({ ...e, isBookmarked: true }))} onBookmarkChange={handleBookmarkChange} />
      )}
    </div>
  );
};

export default Bookmarks;
