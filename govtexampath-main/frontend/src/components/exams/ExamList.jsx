import React from 'react';
import ExamCard from './ExamCard';
import EmptyState from '../common/EmptyState';
import { FiFileText } from 'react-icons/fi';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
    <div className="flex gap-3 mb-4">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex gap-2">
      <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

const ExamList = ({ exams = [], loading = false, onBookmarkChange }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!exams.length) {
    return (
      <EmptyState
        icon={FiFileText}
        title="No exams found"
        description="No exams match your current filters. Try adjusting your search or category."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <ExamCard key={exam._id} exam={exam} onBookmarkChange={onBookmarkChange} />
      ))}
    </div>
  );
};

export default ExamList;
