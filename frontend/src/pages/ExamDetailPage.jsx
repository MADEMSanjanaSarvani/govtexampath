import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ExamDetail from '../components/exams/ExamDetail';
import ExamList from '../components/exams/ExamList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getExamById, getExams } from '../services/examService';
import toast from 'react-hot-toast';

const ExamDetailPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const data = await getExamById(id);
        const examData = data.exam || data;
        setExam(examData);

        if (examData.category) {
          try {
            const relatedData = await getExams({ category: examData.category, limit: 3 });
            const all = relatedData.exams || relatedData || [];
            setRelated(all.filter((e) => e._id !== id).slice(0, 3));
          } catch {
            setRelated([]);
          }
        }
      } catch {
        toast.error('Failed to load exam details');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Exam not found</h2>
        <p className="text-gray-500 dark:text-gray-400">The exam you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ExamDetail exam={exam} />

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Exams</h2>
          <ExamList exams={related} />
        </div>
      )}
    </div>
  );
};

export default ExamDetailPage;
