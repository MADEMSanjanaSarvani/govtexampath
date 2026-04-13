import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import ExamForm from '../../components/admin/ExamForm';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getExams, createExam, updateExam, deleteExam } from '../../services/examService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import SEO from '../../components/common/SEO';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (search) params.search = search;
      const data = await getExams(params);
      setExams(data.exams || data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleCreate = async (formData) => {
    await createExam(formData);
    toast.success('Exam created!');
    setShowForm(false);
    fetchExams();
  };

  const handleUpdate = async (formData) => {
    await updateExam(editingExam._id, formData);
    toast.success('Exam updated!');
    setEditingExam(null);
    setShowForm(false);
    fetchExams();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await deleteExam(id);
      toast.success('Exam deleted');
      fetchExams();
    } catch {
      toast.error('Failed to delete exam');
    }
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  };

  return (
    <AdminLayout>
      <SEO title="Manage Exams" path="/admin/exams" description="Admin panel - manage government exam listings on GovtExamPath." />
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Exams</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, and manage exam listings</p>
          </div>
          <button
            onClick={() => { setEditingExam(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" /> Add Exam
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <ExamForm exam={editingExam} onSubmit={editingExam ? handleUpdate : handleCreate} />
          </div>
        )}

        <div className="mb-4">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search exams..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="min-h-[40vh]" />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Last Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Created</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {exams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">No exams found</td>
                    </tr>
                  ) : (
                    exams.map((exam) => (
                      <tr key={exam._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">{exam.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-medium">
                            {exam.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(exam.lastDate)}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(exam.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(exam)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(exam._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </AdminLayout>
  );
};

export default ManageExams;
