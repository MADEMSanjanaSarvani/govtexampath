import React, { useState, useEffect } from 'react';
import { FiBookmark } from 'react-icons/fi';
import ExamList from '../components/exams/ExamList';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBookmarks } from '../services/examService';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const Bookmarks = () => {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getBookmarks();
        const list = data.exams || data.data || data;
        if (active) setBookmarks(Array.isArray(list) ? list : []);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchBookmarks();
    return () => { active = false; };
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
      <SEO title="My Bookmarks" path="/bookmarks" description="Your saved government exams. Quickly access bookmarked UPSC, SSC, Banking, Railways and other exam details." />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('bookmarksTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('bookmarksSubtitle')}</p>
      </div>

      {error ? (
        <p className="text-red-500 text-center py-8">Failed to load bookmarks. Please try again.</p>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title={t('bookmarksEmpty')}
          description={t('bookmarksEmptyDesc')}
        />
      ) : (
        <ExamList exams={bookmarks.map(e => ({ ...e, isBookmarked: true }))} onBookmarkChange={handleBookmarkChange} />
      )}
    </div>
  );
};

export default Bookmarks;
